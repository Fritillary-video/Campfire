package com.campfire.app.Campfire.Service;

import com.campfire.app.Campfire.Model.Video;
import com.campfire.app.Campfire.Repository.VideoRepository;
import com.campfire.app.Campfire.dto.UploadVideoResponse;
import com.campfire.app.Campfire.dto.VideoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class VideoService {
    private final S3Service s3Service;
    private final VideoRepository videoRepository;
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
//        savedVideo.setVideoUrl(videoDto.getVideoUrl());
        savedVideo.setThumbnailUrl(videoDto.getThumbnailUrl());
        savedVideo.setTags(videoDto.getTags());
        savedVideo.setDescription(videoDto.getDescription());

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

    Video getVideoById(String videoId){
        // find video by id
        return videoRepository.findById(videoId)
                .orElseThrow(()-> new IllegalArgumentException("Cannot find video by id - "+ videoId));
    }
}
