import { Component, OnInit } from '@angular/core';
import { VideoService } from '../video.service';
import { VideoDto } from '../video-dto';
import { UserService } from '../user.service';

@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.css']
})
export class FeaturedComponent implements OnInit{

  featuredVideos: Array<VideoDto> = [];

  constructor(private videoService: VideoService, private userService: UserService) {
    userService.idCheck();
  }

  ngOnInit(): void {
    this.videoService.getAllVideos().subscribe(response => {
      this.featuredVideos = response;
    });
  }

  isPublic(video: VideoDto): boolean{
    return video.videoStatus === "PUBLIC";
  }

}
