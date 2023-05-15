import { Component, OnInit } from '@angular/core';
import { VideoService } from '../video.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit{
  
  searchResults: Array<String> = [];

  constructor(private videoService: VideoService) { }

  ngOnInit(): void {
    const searchResults = this.videoService.getSearchResults();
    
  }
}
