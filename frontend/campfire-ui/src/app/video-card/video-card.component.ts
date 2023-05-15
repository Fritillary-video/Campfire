import { Component, Input } from '@angular/core';
import { VideoDto } from '../video-dto';
import { UserService } from '../user.service';
//import { UserInfoDTO } from '../user-into-dto';
import { SimpleChanges } from '@angular/core';



@Component({
  selector: 'app-video-card',
  templateUrl: './video-card.component.html',
  styleUrls: ['./video-card.component.css']
})


export class VideoCardComponent {
  @Input()
  video!: VideoDto;

  userEmail: string = '';

  constructor(private userService: UserService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['video'] && this.video) {
      this.userService.getUserProfile(this.video.userId)
        .subscribe(userInfo => this.userEmail = userInfo.email);
    }
  }
}


