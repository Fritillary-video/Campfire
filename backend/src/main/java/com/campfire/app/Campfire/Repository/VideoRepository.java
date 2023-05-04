package com.campfire.app.Campfire.Repository;

import com.campfire.app.Campfire.Model.Video;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface VideoRepository extends MongoRepository<Video, String> {
}
