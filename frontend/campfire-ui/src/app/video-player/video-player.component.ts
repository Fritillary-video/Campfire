import { Component, Input } from '@angular/core';
import {VgApiService} from '@videogular/ngx-videogular/core';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent {
  @Input()
  videoUrl!: string | '';
  api!: VgApiService;

  constructor(){

  }
  ngOnInit(): void{
  }

//   onPlayerReady(api: VgApiService) {
//      this.api = api;
//   }
}
