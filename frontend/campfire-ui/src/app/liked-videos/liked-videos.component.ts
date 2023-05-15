import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { VideoDto } from '../video-dto';

@Component({
  selector: 'app-liked-videos',
  templateUrl: './liked-videos.component.html',
  styleUrls: ['./liked-videos.component.css']
})
export class LikedVideosComponent {

  likedVideos: Array<VideoDto> = [];

  constructor(private userService: UserService) {
    userService.idCheck();

   }

  ngOnInit(): void {
      const userId = this.userService.getUserId();
      this.userService.getLikedVideos(userId).subscribe(response => {
        this.likedVideos = response;
      });
  }
}
