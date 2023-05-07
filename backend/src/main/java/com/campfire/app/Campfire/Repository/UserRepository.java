package com.campfire.app.Campfire.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.campfire.app.Campfire.Model.User;

public interface UserRepository extends MongoRepository<User, String> {
    
    
}
