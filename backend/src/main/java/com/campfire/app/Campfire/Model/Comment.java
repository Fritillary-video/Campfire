package com.campfire.app.Campfire.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
    @Id
    private String commentId;
    private String text;
    private String authorId;
    private String authorEmail;
    private Integer likeCount;
    private Integer dislikeCount;
    private String datePosted;
}
