import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { VideoDto } from './video-dto';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userId: string = '';

  constructor(private httpClient: HttpClient, private oss: OidcSecurityService, private router: Router) {
  }

  subscribeToUser(userId: string): Observable<boolean> {
    console.log(userId);
    return this.httpClient.post<boolean>("http://localhost:8080/api/user/subscribe/" + userId, null);
  }

  unsubscribeToUser(userId: string): Observable<boolean> {
    return this.httpClient.post<boolean>("http://localhost:8080/api/user/unsubscribe/" + userId, null);
  }

  getHistory(userId: string): Observable<VideoDto[]> {
    return this.httpClient.get<VideoDto[]>(`http://localhost:8080/api/user/${userId}/history`);
  }

  getLikedVideos(userId: string): Observable<VideoDto[]> {
    return this.httpClient.get<VideoDto[]>(`http://localhost:8080/api/user/${userId}/liked-videos`);
  }

  getDislikedVideos(userId: string): Observable<VideoDto[]> {
    return this.httpClient.get<VideoDto[]>(`http://localhost:8080/api/user/${userId}/disliked-videos`);
  }

  getSubscriptionVideos(userId: string): Observable<VideoDto[]> {
    return this.httpClient.get<VideoDto[]>(`http://localhost:8080/api/user/${userId}/subscribed-videos`);
  }

  registerUser() {
    this.oss.userData$.subscribe(userData => {
      this.oss.getAccessToken().subscribe(access => {
        //console.log("data " + JSON.stringify(access));
        if (access !== null) {
          this.httpClient.get("http://localhost:8080/api/user/register", { responseType: "text" })
            .subscribe(data => {
              this.userId = data;
              //console.log("In user Service, userId: "+this.userId);
              this.router.navigateByUrl('/featured');
            });
        }
      });
    });
  }

  getUserId(): string {
    //console.log("in get userId in user servide, userId: "+this.userId);
    return this.userId;
  }
}
 