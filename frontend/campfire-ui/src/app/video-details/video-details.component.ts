import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../video.service';
import { UserService } from '../user.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { UserInfoDTO } from '../userInfoDTO';

@Component({
  selector: 'app-video-details',
  templateUrl: './video-details.component.html',
  styleUrls: ['./video-details.component.css']
})
export class VideoDetailsComponent {
  videoId!: string;
  videoUrl!: string;
  videoAvailable: boolean = false;
  videoTitle!: string;
  videoDescription!: string;
  tags: Array<string> = [];
  likeCount: number = 0;
  dislikeCount: number = 0;
  viewCount: number = 0;
  datePosted!: string;
  showSubscribeButton: boolean = true;
  showUnsubscribeButton: boolean = false;
  isAuthenticated: boolean = false;
  uploaderId!: string; // new field
  accountName!: string;
  subscribers!: number;


 constructor(private activatedRoute: ActivatedRoute, private videoService: VideoService,
     private userService: UserService, private oidcSecurityService: OidcSecurityService) {
     this.videoId = this.activatedRoute.snapshot.params['videoId'];

     this.videoService.getVideo(this.videoId).subscribe(data => {
       this.videoUrl = data.videoUrl;
       this.videoAvailable = true;
       this.videoTitle = data.title;
       this.videoDescription = data.description;
       this.tags = data.tags;
       this.likeCount = data.likeCount;
       this.dislikeCount = data.dislikeCount;
       this.viewCount = data.viewCount;
       this.datePosted = data.datePosted;
       this.uploaderId = data.userId;
       console.log(data.userId);

       // Call getUserProfile() after uploaderId is set
       this.userService.getUserProfile(this.uploaderId).subscribe(profileData => {
         this.accountName = profileData.email;
         this.subscribers = profileData.subscribers.size;
       });

       console.log("userId:" + data.userId);
     });
 }



   ngOnInit(): void {
     this.oidcSecurityService.isAuthenticated$.subscribe(({isAuthenticated}) => {
       this.isAuthenticated = isAuthenticated;


       // If the user is authenticated, check if they are subscribed to the video uploader
       if (this.isAuthenticated) {
         this.userService.isSubscribed(this.uploaderId).subscribe(isSubscribed => {
           this.showSubscribeButton = !isSubscribed;
           this.showUnsubscribeButton = isSubscribed;
         });
       }
     });
   }

  likeVideo() {
    this.videoService.likeVideo(this.videoId).subscribe(data => {
      this.likeCount = data.likeCount;
      this.dislikeCount = data.dislikeCount;
    });
  }

  dislikeVideo() {
    this.videoService.dislikeVideo(this.videoId).subscribe(data => {
      this.likeCount = data.likeCount;
      this.dislikeCount = data.dislikeCount;
    });
  }

  subscribeToUser() {
    const currentUserId = this.userService.getUserId(); // Get the current user's ID
    const uploaderId = this.uploaderId; // Get the uploader's ID
    this.userService.subscribeToUser(currentUserId, uploaderId).subscribe(data => {
      this.showSubscribeButton = false;
      this.showUnsubscribeButton = true;
    });
  }

  unsubscribeToUser() {
    const currentUserId = this.userService.getUserId();
    const uploaderId = this.uploaderId; // Get the uploader's ID
    this.userService.unsubscribeToUser(currentUserId, uploaderId).subscribe(data => {
      this.showSubscribeButton = true;
      this.showUnsubscribeButton = false;
    });
  }

}
