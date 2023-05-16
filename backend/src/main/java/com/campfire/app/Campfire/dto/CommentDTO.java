package com.campfire.app.Campfire.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private String commentId;
    private String text;
    private String authorId;
    private String authorEmail;
    private Integer likeCount;
    private Integer dislikeCount;
    private String datePosted;
}
