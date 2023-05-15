import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { VideoDto } from '../video-dto';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  userOwned: Array<VideoDto> = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
      const userId = this.userService.getUserId();
      this.userService.getUserOwned(userId).subscribe(response => {
        this.userOwned = response;
      });
  }

}