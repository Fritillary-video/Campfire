import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../video.service';

@Component({
  selector: 'app-video-details',
  templateUrl: './video-details.component.html',
  styleUrls: ['./video-details.component.css']
})
export class VideoDetailsComponent {
  videoId!: string;
  videoUrl!: string;
  videoAvailable: boolean = false;
  videoTitle!:string;
  videoDescription!: string;
  tags: Array<string> = [];
  likeCount: number = 0;
  dislikeCount: number = 0;
  viewCount: number = 0;

  constructor(private activatedRoute: ActivatedRoute, private videoService: VideoService){
    this.videoId = this.activatedRoute.snapshot.params['videoId'];
    this.videoService.getVideo(this.videoId).subscribe(data=>{
      this.videoUrl = data.videoUrl;
      this.videoAvailable = true;
      this.videoTitle = data.title;
      this.videoDescription = data.description;
      this.tags = data.tags;
      this.likeCount = data.likeCount;
      this.dislikeCount = data.dislikeCount;
      this.viewCount = data.viewCount;
    })
  }

}
