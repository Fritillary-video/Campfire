import { Component, Input, SimpleChanges } from '@angular/core';
import { VideoDto } from '../video-dto';
import { UserService } from '../user.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-suggested-video-card',
  templateUrl: './suggested-video-card.component.html',
  styleUrls: ['./suggested-video-card.component.css']
})
export class SuggestedVideoCardComponent {
  @Input()
  video!: VideoDto;

  userEmail: string = '';

  constructor(private userService: UserService, public dialog: MatDialog) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['video'] && this.video) {
      this.userService.getUserProfile(this.video.userId)
        .subscribe(userInfo => this.userEmail = userInfo.email.split('@').shift()!);
    }
  }

  getUserId(): string {
    return this.userService.getUserId();
  }
}
