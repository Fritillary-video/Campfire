package com.campfire.app.Campfire.Service;

import com.campfire.app.Campfire.Model.Comment;
import com.campfire.app.Campfire.Model.Video;
import com.campfire.app.Campfire.Repository.VideoRepository;
import com.campfire.app.Campfire.dto.CommentDTO;
import com.campfire.app.Campfire.dto.UploadVideoResponse;
import com.campfire.app.Campfire.dto.VideoDto;
import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VideoService {
    private final S3Service s3Service;
    private final VideoRepository videoRepository;
    private final UserService userService;
    private Set<String> foundVideos;

    public UploadVideoResponse uploadVideo(MultipartFile multipartFile) {
        // Upload file to AWS S3
        // Save Video Data to Database
        String videoUrl = s3Service.uploadFile(multipartFile);
        var video = new Video();
        video.setVideoUrl(videoUrl);

        var savedVideo = videoRepository.save(video);
        return new UploadVideoResponse(savedVideo.getId(), savedVideo.getVideoUrl());
    }

    public VideoDto editVideo(VideoDto videoDto) {
        Video savedVideo = getVideoById(videoDto.getId());

        // map dto to entity
        savedVideo.setTitle(videoDto.getTitle());
        savedVideo.setVideoStatus(videoDto.getVideoStatus());
        // savedVideo.setVideoUrl(videoDto.getVideoUrl());
        savedVideo.setThumbnailUrl(videoDto.getThumbnailUrl());
        savedVideo.setTags(videoDto.getTags());
        savedVideo.setDescription(videoDto.getDescription());
        savedVideo.setUserId(videoDto.getUserId());
        savedVideo.setDatePosted(videoDto.getDatePosted());

        // save vid to db
        videoRepository.save(savedVideo);
        return videoDto;
    }

    public String uploadThumbnail(MultipartFile file, String videoId) {
        var savedVideo = getVideoById(videoId);
        String thumbnailUrl = s3Service.uploadFile(file);
        savedVideo.setThumbnailUrl(thumbnailUrl);
        videoRepository.save(savedVideo);
        return thumbnailUrl;
    }

    Video getVideoById(String videoId) {
        // find video by id
        return videoRepository.findById(videoId)
                .orElseThrow(() -> new IllegalArgumentException("Cannot find video by id - " + videoId));
    }

    public VideoDto getVideoDetails(String videoId) {
        Video savedVideo = getVideoById(videoId);

        increaseVideoCount(savedVideo);
        // userService.addVideoToHistory(videoId);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken)) {
            userService.addVideoToHistory(videoId);
        }

        return mapToVideoDto(savedVideo);
    }

    private void increaseVideoCount(Video savedVideo) {
        savedVideo.increaseViewCount();
        videoRepository.save(savedVideo);
    }

    private VideoDto mapToVideoDto(Video video) {
        VideoDto videoDto = new VideoDto();
        videoDto.setVideoUrl(video.getVideoUrl());
        videoDto.setThumbnailUrl(video.getThumbnailUrl());
        videoDto.setId(video.getId());
        videoDto.setUserId(video.getUserId());
        videoDto.setTitle(video.getTitle());
        videoDto.setDescription(video.getDescription());
        videoDto.setTags(video.getTags());
        videoDto.setVideoStatus(video.getVideoStatus());
        videoDto.setLikeCount(video.getLikes().get());
        videoDto.setDislikeCount(video.getDislikes().get());
        videoDto.setViewCount(video.getViewCount().get());
        videoDto.setDatePosted(video.getDatePosted());
        return videoDto;
    }

    public VideoDto likeVideo(String videoId) {
        // Get video by ID
        Video videoById = getVideoById(videoId);

        // if user already liked the video, then decrement like count
        if (userService.ifLikedVideo(videoId)) {
            videoById.decrementLikes();
            userService.removeFromLikedVideos(videoId);
            // if user already disliked the video, then increment like count and decrement
            // dislike count
        } else if (userService.ifDisLikedVideo(videoId)) {
            videoById.decrementDisLikes();
            userService.removeFromDislikedVideos(videoId);
            videoById.incrementLikes();
            userService.addToLikedVideos(videoId);
            // increment like count
        } else {
            videoById.incrementLikes();
            userService.addToLikedVideos(videoId);
        }

        videoRepository.save(videoById);

        return mapToVideoDto(videoById);
    }

    public VideoDto dislikeVideo(String videoId) {
        // Get video by ID
        Video videoById = getVideoById(videoId);

        // if user already liked the video, then decrement like count
        if (userService.ifDisLikedVideo(videoId)) {
            videoById.decrementDisLikes();
            userService.removeFromDislikedVideos(videoId);
            // if user already disliked the video, then increment like count and decrement
            // dislike count
        } else if (userService.ifLikedVideo(videoId)) {
            videoById.decrementLikes();
            userService.removeFromLikedVideos(videoId);
            videoById.incrementDisLikes();
            userService.addToDisLikedVideos(videoId);
            // increment like count
        } else {
            videoById.incrementDisLikes();
            userService.addToDisLikedVideos(videoId);
        }

        videoRepository.save(videoById);

        return mapToVideoDto(videoById);
    }

    public void addComment(String videoId, CommentDTO commentDto) {
        Video video = getVideoById(videoId);
        Comment comment = new Comment();
        comment.setText(commentDto.getCommentText());
        comment.setAuthorId(commentDto.getAuthorId());
        video.addComment(comment);
        videoRepository.save(video);
    }

    public List<CommentDTO> getAllComments(String videoId) {
        Video video = getVideoById(videoId);
        List<Comment> commentList = video.getCommentList();
        return commentList.stream().map(this::mapToCommentDto).collect(Collectors.toList());
    }

    private CommentDTO mapToCommentDto(Comment comment) {
        CommentDTO commentDto = new CommentDTO();
        commentDto.setCommentText(comment.getText());
        commentDto.setAuthorId(comment.getAuthorId());
        return commentDto;
    }

    public Set<String> searchForVideos(String search){
        search = search.trim();
        String[] actualSearch = search.split(" ");
        for (VideoDto videoData : getAllVideos()) {
            for (String string : actualSearch) {
                if(videoData.getTitle().contains(string)){
                    foundVideos.add(videoData.getVideoUrl());
                }
            }
        }
        return foundVideos;
    }

    public List<VideoDto> getAllVideos() {
        return videoRepository.findAll().stream().map(this::mapToVideoDto).collect(Collectors.toList());
    }


}
