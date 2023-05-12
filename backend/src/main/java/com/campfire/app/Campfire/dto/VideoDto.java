package com.campfire.app.Campfire.dto;

import com.campfire.app.Campfire.Model.VideoStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VideoDto {
    private String id;
    private String title;
    private String description;
    private String userId;
    private Set<String> tags;
    private String videoUrl;
    private String thumbnailUrl;
    private VideoStatus videoStatus;
    private Integer likeCount;
    private Integer dislikeCount;
    private Integer viewCount;
}
