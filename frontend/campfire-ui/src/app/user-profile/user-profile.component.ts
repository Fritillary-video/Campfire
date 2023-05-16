import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { VideoDto } from '../video-dto';
import { UserInfoDTO } from '../user-info-dto';
import { ActivatedRoute } from '@angular/router'; // Add this import

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

  subscribers: number = 0;

  // Inject ActivatedRoute in the constructor
  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    let userId = this.route.snapshot.paramMap.get('userId');
    if (!userId) {
      userId = this.userService.getUserId();
    }

    if (userId) {
      this.userService.getUserProfile(userId).subscribe(response => {
        this.userProfile = response;
        this.subscribers = Array.from(this.userProfile.subscribers).length;
      });

      this.userService.getUserOwned(userId).subscribe(response => {
        this.userOwned = response;
      });
    }
  }
}
