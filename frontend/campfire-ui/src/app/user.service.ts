import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { VideoDto } from './video-dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private userId: string = '';

  constructor(private httpClient: HttpClient, private oss: OidcSecurityService) {
  }

  subscribeToUser(userId: string): Observable<boolean> {
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
        console.log("data " + JSON.stringify(access));
        if (access !== null) {
          this.httpClient.get("http://localhost:8080/api/user/register", { responseType: "text" })
            .subscribe(data => {
              console.log("got data")
              this.userId = data;
            });
        }
      });
    });
  }

  getUserId(): string {
    return this.userId;
  }
}
