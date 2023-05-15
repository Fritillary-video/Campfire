package com.campfire.app.Campfire.Service;

import com.campfire.app.Campfire.Model.Video;
import com.campfire.app.Campfire.Repository.VideoRepository;
import com.campfire.app.Campfire.dto.UserInfoDTO;
import com.campfire.app.Campfire.dto.VideoDto;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.campfire.app.Campfire.Model.User;
import com.campfire.app.Campfire.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final VideoRepository videoRepository;

    public User getCurrentUser() {
        String sub = ((Jwt) (SecurityContextHolder.getContext().getAuthentication().getPrincipal())).getClaim("sub");

        return userRepository.findBySub(sub)
                .orElseThrow(() -> new IllegalArgumentException("Cannot find user with sub - " + sub));
    }

    public void addToLikedVideos(String videoId) {
        User currentUser = getCurrentUser();
        currentUser.addToLikeVideos(videoId);
        userRepository.save(currentUser);
    }

    public boolean ifLikedVideo(String videoId) {
        return getCurrentUser().getLikedVideos().stream().anyMatch(likedVideo -> likedVideo.equals(videoId));
    }

    public boolean ifDisLikedVideo(String videoId) {
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

    public void subscribeUser(String userId) {
        User currentUser = getCurrentUser();
        currentUser.addToSubscribedToUsers(userId);
        User user = findUserById(userId);
        user.addToSubscribers(user.getId());

        userRepository.save(currentUser);
        userRepository.save(user);
    }

    public void unsubscribeUser(String userId) {
        User currentUser = getCurrentUser();
        currentUser.removeFromSubscribedToUsers(userId);
        User user = findUserById(userId);
        user.removeFromSubscribers(user.getId());

        userRepository.save(currentUser);
        userRepository.save(user);
    }

    public User findUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("cannot find user id: " + userId));
    }

    public List<VideoDto> userHistory(String userId) {
        User user = findUserById(userId);
        Set<String> videoIds = user.getVideoHistory();

        List<VideoDto> videoDtos = new ArrayList<>();
        for (String videoId : videoIds) {
            Video video = videoRepository.findById(videoId)
                    .orElseThrow(() -> new IllegalArgumentException("Cannot find video id: " + videoId));

            VideoDto videoDto = convertToDto(video);
            videoDtos.add(videoDto);
        }

        return videoDtos;
    }

    private VideoDto convertToDto(Video video) {
        return new VideoDto(
                video.getId(),
                video.getTitle(),
                video.getDescription(),
                video.getUserId(),
                video.getTags(),
                video.getVideoUrl(),
                video.getThumbnailUrl(),
                video.getVideoStatus(),
                video.getLikes().get(),
                video.getDislikes().get(),
                video.getViewCount().get(),
                video.getDatePosted());
    }

    public List<VideoDto> likedVideos(String userId) {
        User user = findUserById(userId);
        Set<String> videoIds = user.getLikedVideos();

        List<VideoDto> videoDtos = new ArrayList<>();
        for (String videoId : videoIds) {
            Video video = videoRepository.findById(videoId)
                    .orElseThrow(() -> new IllegalArgumentException("Cannot find video id: " + videoId));

            VideoDto videoDto = convertToDto(video);
            videoDtos.add(videoDto);
        }

        return videoDtos;
    }

    public List<VideoDto> dislikedVideos(String userId) {
        User user = findUserById(userId);
        Set<String> videoIds = user.getDislikedVideos();

        List<VideoDto> videoDtos = new ArrayList<>();
        for (String videoId : videoIds) {
            Video video = videoRepository.findById(videoId)
                    .orElseThrow(() -> new IllegalArgumentException("Cannot find video id: " + videoId));

            VideoDto videoDto = convertToDto(video);
            videoDtos.add(videoDto);
        }

        return videoDtos;
    }

    public List<VideoDto> subscribedVideos(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        Set<String> subscribedUserIds = user.getSubscribedToUsers();

        List<VideoDto> videoDtos = new ArrayList<>();
        for (String subscribedUserId : subscribedUserIds) {
            // find videos by user ID
            List<Video> videos = videoRepository.findByUserId(subscribedUserId);

            for (Video video : videos) {
                VideoDto videoDto = convertToDto(video);
                videoDtos.add(videoDto);
            }
        }

        return videoDtos;
    }

    public UserInfoDTO userProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        UserInfoDTO userInfoDTO = new UserInfoDTO();
        userInfoDTO.setId(user.getId());
        userInfoDTO.setSub(user.getSub());
        userInfoDTO.setGivenName(user.getFirstName());
        userInfoDTO.setFamilyName(user.getLastName());
        userInfoDTO.setName(user.getFullName());
        userInfoDTO.setEmail(user.getEmailAddress());
        userInfoDTO.setSubscribers(user.getSubscribers());

        return userInfoDTO;
    }


    public boolean isSubscribed(String userId) {
        User currentUser = getCurrentUser();
        return currentUser.getSubscribedToUsers().contains(userId);
    }

    public List<VideoDto> videosOwned(String userId) {
        List<VideoDto> videoDtos = new ArrayList<>();
            List<Video> videos = videoRepository.findByUserId(userId);

            for (Video video : videos) {
                VideoDto videoDto = convertToDto(video);
                videoDtos.add(videoDto);
            }
        return videoDtos;
    }
}
