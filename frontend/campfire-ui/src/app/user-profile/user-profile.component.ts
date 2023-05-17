import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { VideoService } from '../video.service';
import { VideoDto } from '../video-dto';
import { UserInfoDTO } from '../user-info-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  showSubscribeButton: boolean = true;
  showUnsubscribeButton: boolean = false;
  userOwned: Array<VideoDto> = [];
  userProfile: UserInfoDTO = {
    id: '',
    sub: '',
    givenName: '',
    familyName: '',
    name: '',
    picture: '',
    email: '',
    subscribers: new Set<string>()
  };
  userId?: string; // Only this property should exist, remove any other 'userId' declaration
  subscribers: number = 0;
isAuthenticated: boolean = false;

  constructor(public userService: UserService, private route: ActivatedRoute,
              private videoService: VideoService, private router: Router,
              private oidcSecurityService: OidcSecurityService) { } // add OidcSecurityService here

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    if (!this.userId) {
      this.userId = this.userService.getUserId();
    }

    if (this.userId) {
      this.userService.getUserProfile(this.userId).subscribe(response => {
        this.userProfile = response;
        this.subscribers = Array.from(this.userProfile.subscribers).length;
      });

      this.userService.getUserOwned(this.userId).subscribe(response => {
        this.userOwned = response;
      });

      this.oidcSecurityService.isAuthenticated$.subscribe(({isAuthenticated}) => {
        this.isAuthenticated = isAuthenticated;
        if (this.isAuthenticated) {
          this.checkSubscriptionStatus();
        }
      });
    }
  }

  deleteVideo(videoId: string): void {
    this.videoService.deleteVideo(videoId).subscribe(() => {
      this.userOwned = this.userOwned.filter(video => video.id !== videoId);
    });
  }

  goToUploadVideo(): void {
    this.router.navigateByUrl('/upload-video');
  }

  checkSubscriptionStatus(): void {
    if (this.userId) { // Add this check
      this.userService.isSubscribed(this.userId).subscribe(isSubscribed => {
        this.showSubscribeButton = !isSubscribed;
        this.showUnsubscribeButton = isSubscribed;
      });
    }
  }

  subscribeToUser() {
    const currentUserId = this.userService.getUserId();
    if (currentUserId && this.userId) { // Add this check
      this.userService.subscribeToUser(currentUserId, this.userId).subscribe(data => {
        this.checkSubscriptionStatus();
      });
    }
  }

  unsubscribeToUser() {
    const currentUserId = this.userService.getUserId();
    if (currentUserId && this.userId) { // Add this check
      this.userService.unsubscribeToUser(currentUserId, this.userId).subscribe(data => {
        this.checkSubscriptionStatus();
      });
    }
  }

}
