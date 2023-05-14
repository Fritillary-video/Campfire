import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../video.service';
import { UserService } from '../user.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';

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
      console.log("userId:" + data.userId);
    })
  }

  ngOnInit(): void{
    this.oidcSecurityService.isAuthenticated$.subscribe(({isAuthenticated}) => {
        this.isAuthenticated = isAuthenticated;
    })
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
    this.userService.subscribeToUser(this.uploaderId).subscribe(data => {
      this.showSubscribeButton = false;
      this.showUnsubscribeButton = true;
    });
  }

  unsubscribeToUser() {
    this.userService.unsubscribeToUser(this.uploaderId).subscribe(data => {
      this.showSubscribeButton = true;
      this.showUnsubscribeButton = false;
    });
  }
}
