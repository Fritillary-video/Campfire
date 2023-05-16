import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoService } from '../video.service';
import { UserService } from '../user.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { VideoDto } from '../video-dto';

@Component({
  selector: 'app-video-details',
  templateUrl: './video-details.component.html',
  styleUrls: ['./video-details.component.css']
})
export class VideoDetailsComponent implements OnInit {
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
  subscribers: number = 0;
  searchedResults! : Array<VideoDto>;
  currentUserId!: string;
  suggestedVideos: Set<VideoDto> = new Set();



  constructor(private activatedRoute: ActivatedRoute, private videoService: VideoService,
    private userService: UserService, private oidcSecurityService: OidcSecurityService,
    private router : Router) {
    this.userService.idCheck();
    this.videoId = this.activatedRoute.snapshot.params['videoId'];
  }

  //put this method which runs at runtime to be before we load in video info and user info to make
  //subscribe button to retain its pressed state
  ngOnInit(): void {
      this.oidcSecurityService.isAuthenticated$.subscribe(({isAuthenticated}) => {
          this.isAuthenticated = isAuthenticated;
          if (isAuthenticated) {
            this.currentUserId = this.userService.getUserId();
          }
      });

      this.videoService.getVideo(this.videoId).subscribe(data => {
        console.log(data);
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

        this.userService.getUserProfile(this.uploaderId).subscribe(profileData => {
          console.log(profileData);
          console.log("in video details, user Id: "+this.uploaderId);
          this.accountName = profileData.email.split('@').shift()!;
          this.subscribers = Array.from(profileData.subscribers).length;

          if (this.isAuthenticated) {
            this.checkSubscriptionStatus();
          }
        });
        
        let searchField = "";
        this.tags.forEach((tag)=> searchField += tag + " ")
        searchField += this.videoTitle;

        this.videoService.search(searchField).subscribe(data => {
          data.forEach((item) => {
            if(item.id !== this.videoId){
              this.suggestedVideos.add(item)}
          });
        })
        // this.videoService.getAllVideos().subscribe(data => {
        //   data.forEach((item) =>{if (!this.suggestedVideos.has(item) && item.id !== this.videoId){
        //     this.suggestedVideos.add(item);
        //   }})
        // });
      });

      
  }

  searchBasedOnTag(tag : string) : void {
   this.router.navigateByUrl('/search/'+tag);
  }

  checkSubscriptionStatus(): void {
    this.userService.isSubscribed(this.uploaderId).subscribe(isSubscribed => {
      this.showSubscribeButton = !isSubscribed;
      this.showUnsubscribeButton = isSubscribed;
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
    const uploaderId = this.uploaderId;
    this.userService.subscribeToUser(this.currentUserId, uploaderId).subscribe(data => {
      this.checkSubscriptionStatus();
    });
  }

  unsubscribeToUser() {
    const uploaderId = this.uploaderId;
    this.userService.unsubscribeToUser(this.currentUserId, uploaderId).subscribe(data => {
      this.checkSubscriptionStatus();
    });
  }

  videoRedirect(id : string) {
    this.router.navigateByUrl(/video-details/+id);
    location.reload();
  }
}
