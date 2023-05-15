import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { VideoDto } from '../video-dto';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  history: Array<VideoDto> = [];

  constructor(private userService: UserService) {
   userService.idCheck();
   }

  ngOnInit(): void {
      const userId = this.userService.getUserId();
      this.userService.getHistory(userId).subscribe(response => {
        this.history = response;
      });
  }

}
