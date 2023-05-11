import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentDto } from './comment-dto';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  
  apiUrl : string = "http://localhost:8080";

  constructor(private httpClient : HttpClient) { }

  postComment(commentDTO : any, videoId : string) : Observable<any>{
    return this.httpClient.post<any>(this.apiUrl+"/api/videos/"+videoId+"/comment", commentDTO);
  }

  getAllComments(videoId: string) : Observable<Array<CommentDto>>{
    return this.httpClient.get<CommentDto[]>(this.apiUrl+"/api/videos/"+videoId+"/comment");
  }

}
