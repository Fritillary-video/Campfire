import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { VideoDto } from '../video-dto';
import { UserInfoDTO } from '../user-info-dto';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

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

  // Add a new property to keep track of the number of subscribers
  subscribers: number = 0;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    const userId = this.userService.getUserId();
    this.userService.getUserProfile(userId).subscribe(response => {
      this.userProfile = response;

      // Update the number of subscribers after getting the user profile
      this.subscribers = Array.from(this.userProfile.subscribers).length;
    });

    this.userService.getUserOwned(userId).subscribe(response => {
      this.userOwned = response;
    });
  }
}
