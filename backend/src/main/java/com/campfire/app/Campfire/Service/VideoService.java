package com.campfire.app.Campfire.Service;

import com.campfire.app.Campfire.Model.Comment;
import com.campfire.app.Campfire.Model.User;
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

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VideoService {
    private final S3Service s3Service;
    private final VideoRepository videoRepository;
    private final UserService userService;
    private Set<VideoDto> foundVideos = new HashSet<>();

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
        User user = userService.getCurrentUser();
        Comment comment = new Comment();
        UUID uuid = UUID.randomUUID();

        comment.setCommentId(uuid.toString());
        comment.setAuthorEmail(user.getEmailAddress());
        comment.setText(commentDto.getText());
        comment.setAuthorId(commentDto.getAuthorId());
        comment.setDatePosted(commentDto.getDatePosted());
        comment.setLikeCount(0);
        comment.setDislikeCount(0);
        

        // String commentId = videoRepository.save(video).getId();
        // comment.setCommentId(commentId);
        video.addComment(comment);
        videoRepository.save(video);

        //return comment.getCommentId();
    }

    public List<CommentDTO> getAllComments(String videoId) {
        Video video = getVideoById(videoId);
        List<Comment> commentList = video.getCommentList();
        return commentList.stream().map(this::mapToCommentDto).collect(Collectors.toList());
    }

    private CommentDTO mapToCommentDto(Comment comment) {
        CommentDTO commentDto = new CommentDTO();

        commentDto.setCommentId(comment.getCommentId());
        commentDto.setText(comment.getText());
        commentDto.setAuthorEmail(comment.getAuthorEmail());
        commentDto.setAuthorId(comment.getAuthorId());
        commentDto.setLikeCount(comment.getLikeCount());
        commentDto.setDislikeCount(comment.getDislikeCount());
        commentDto.setDatePosted(comment.getDatePosted());

        return commentDto;
    }

    public void deleteComment(String videoId, String commentId) {
        Video video = getVideoById(videoId);
        List<Comment> commentList = video.getCommentList();

        // Find the comment with the given commentId
        Optional<Comment> commentOptional = commentList.stream()
                .filter(comment -> comment.getCommentId().equals(commentId))
                .findFirst();

        // If the comment exists, remove it from the list and save the updated video
        if (commentOptional.isPresent()) {
            Comment commentToDelete = commentOptional.get();
            commentList.remove(commentToDelete);
            videoRepository.save(video);
        }
    }

    public Set<VideoDto> searchForVideos(String search) {
        search = search.trim();
        String[] words = search.split(" ");
        return getAllVideos().stream().filter((video) -> {
            for (String word : words) {
                String capitalWord = "";
                if(Character.toLowerCase(word.charAt(word.length()-1)) =='s'){
                    word = word.substring(0, word.length()-1);
                    System.out.println(word);
                }
                capitalWord = Character.toUpperCase(word.charAt(0)) + word.substring(1, word.length());
                System.out.println(capitalWord);
                if (video.getTitle().toLowerCase().contains(word.toLowerCase())) {
                    return true;
                } else if (video.getTags().contains(word.toLowerCase()) 
                || video.getTags().contains(word) 
                || video.getTags().contains(capitalWord)) {
                    return true;
                }
            }
            return false;
        }).collect(Collectors.toSet());
    }

    // public Set<VideoDto> suggestedVideosSearch(Set<VideoDto> videos){
    //     return videos.addAll(getAllVideos());
    // }

    public List<VideoDto> getAllVideos() {
        return videoRepository.findAll().stream().map(this::mapToVideoDto).collect(Collectors.toList());
    }

    public void deleteVideo(String videoId) {
        videoRepository.deleteById(videoId);
    }

}
