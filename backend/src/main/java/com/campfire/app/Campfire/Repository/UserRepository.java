package com.campfire.app.Campfire.Repository;


import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.campfire.app.Campfire.Model.User;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findBySub(String sub);
    
}
