package com.campfire.app.Campfire.Service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.campfire.app.Campfire.Model.User;
import com.campfire.app.Campfire.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User getCurrentUser(){
        String sub = ((Jwt) (SecurityContextHolder.getContext().getAuthentication().getPrincipal())).getClaim("sub");

        return userRepository.findBySub(sub)
        .orElseThrow(()-> new IllegalArgumentException("Cannot find user with sub - " + sub));
    }

    public void addToLikedVideos(String videoId) {
        User currentUser = getCurrentUser();
        currentUser.addToLikeVideos(videoId);
        userRepository.save(currentUser);
    }

    public boolean ifLikedVideo(String videoId){
        return getCurrentUser().getLikedVideos().stream().anyMatch(likedVideo -> likedVideo.equals(videoId));
    }

    public boolean ifDisLikedVideo(String videoId){
        return getCurrentUser().getDislikedVideos().stream().anyMatch(likedVideo -> likedVideo.equals(videoId));
    }

    public void removeFromLikedVideos(String videoId) {
        User currentUser = getCurrentUser();
        currentUser.removeFromLikedVideos(videoId);
        userRepository.save(currentUser);

    }

    public void removeFromDislikedVideos(String videoId) {
        User currentUser = getCurrentUser();
        currentUser.removeFromDisLikedVideos(videoId);
        userRepository.save(currentUser);
    }

    public void addToDisLikedVideos(String videoId) {
        User currentUser = getCurrentUser();
        currentUser.addToDisLikedVideos(videoId);
        userRepository.save(currentUser);
    }

    public void addVideoToHistory(String videoId) {
        User currentUser = getCurrentUser();
        currentUser.addToVideoHistory(videoId);
        userRepository.save(currentUser);
    }

    public void subscribeUser(String userId){
        User currentUser = getCurrentUser();
        currentUser.addToSubscribedToUsers(userId);
        User user = findUserById(userId);
        user.addToSubscribers(user.getId());

        userRepository.save(currentUser);
        userRepository.save(user);
    }

    public void unsubscribeUser(String userId){
        User currentUser = getCurrentUser();
        currentUser.removeFromSubscribedToUsers(userId);
        User user = findUserById(userId);
        user.removeFromSubscribers(user.getId());

        userRepository.save(currentUser);
        userRepository.save(user);
    }

    public User findUserById(String userId){
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("cannot find user id: " + userId));
    }

    public Set<String> userHistory(String userId) {
        User user = findUserById(userId);
        return user.getVideoHistory();
    }
}
