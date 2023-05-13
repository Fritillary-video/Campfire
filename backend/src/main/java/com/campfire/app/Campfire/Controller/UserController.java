package com.campfire.app.Campfire.Controller;

import com.campfire.app.Campfire.Service.UserService;
import com.campfire.app.Campfire.dto.VideoDto;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.campfire.app.Campfire.Service.UserRegistrationService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRegistrationService userRegistrationService;
    private final UserService userService;

    @GetMapping("/register") //   /api/user/register
    @ResponseStatus(HttpStatus.OK)
    public String register(Authentication authentication) {
        Jwt jwt = (Jwt) authentication.getPrincipal();

        return userRegistrationService.registerUser(jwt.getTokenValue());
    }

    @PostMapping("/subscribe/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public boolean subscribeUser(@PathVariable String userId) {
        userService.subscribeUser(userId);
        return true;
    }

    @PostMapping("/unsubscribe/{userId}")
    @ResponseStatus(HttpStatus.OK)
    public boolean unsubscribeUser(@PathVariable String userId) {
        userService.unsubscribeUser(userId);
        return true;
    }

    @GetMapping("{userId}/history")
    @ResponseStatus(HttpStatus.OK)
    public List<VideoDto> userHistory(@PathVariable String userId) {
        return userService.userHistory(userId);
    }

//    @GetMapping("{userId}/liked-videos")
//    @ResponseStatus(HttpStatus.OK)
//    public List<VideoDto> likedVideos(@PathVariable String userId) {
//        return userService.likedVideos(userId);
//    }
//
//    @GetMapping("{userId}/liked-videos")
//    @ResponseStatus(HttpStatus.OK)
//    public List<VideoDto> dislikedVideos(@PathVariable String userId) {
//        return userService.dislikedVideos(userId);
//    }
//
//    @GetMapping("{userId}/subscribed-videos")
//    @ResponseStatus(HttpStatus.OK)
//    public List<VideoDto> subscribedVideos(@PathVariable String userId) {
//        return userService.subscribedVideos(userId);
//    }
}
