package com.campfire.app.Campfire.Service;

import com.campfire.app.Campfire.Model.Video;
import com.campfire.app.Campfire.Repository.VideoRepository;
import com.campfire.app.Campfire.dto.VideoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class VideoService {
    private final S3Service s3Service;
    private final VideoRepository videoRepository;
    public void uploadVideo(MultipartFile multipartFile) {
        // Upload file to AWS S3
        // Save Video Data to Database
        String videoUrl = s3Service.uploadFile(multipartFile);
        var video = new Video();
        video.setVideoUrl(videoUrl);

        videoRepository.save(video);
    }

    public VideoDto editVideo(VideoDto videoDto) {
        // find video by id
        Video savedVideo = videoRepository.findById(videoDto.getId())
                .orElseThrow(()-> new IllegalArgumentException("Cannot find video by id - "+ videoDto.getId()));

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
}
