import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { VideoDto } from '../video-dto';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent {

 subscriptionVideos: Array<VideoDto> = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
      const userId = this.userService.getUserId();
      this.userService.getSubscriptionVideos(userId).subscribe(response => {
        this.subscriptionVideos = response;
      });
  }

}
