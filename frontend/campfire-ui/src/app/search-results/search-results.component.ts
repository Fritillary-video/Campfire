import { Component, Input, OnInit } from '@angular/core';
import { VideoService } from '../video.service';
import { VideoDto } from '../video-dto';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit{
  
  searchTerm : string = "";

  searchResults: Array<VideoDto> = [];

  constructor(private videoService: VideoService, private activatedRoute : ActivatedRoute) {
    this.searchTerm = this.activatedRoute.snapshot.params['searchTerm'];
   }

  ngOnInit(): void {
    //const searchResults = this.videoService.getSearchResults();
    this.videoService.search(this.searchTerm).subscribe(data => {
      this.searchResults = data;
    })
  }
}
