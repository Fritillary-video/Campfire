import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { VideoDto } from './video-dto';
import { Router } from '@angular/router';
import { UserInfoDTO } from './user-info-dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userId: string = '';

  private temp! : UserInfoDTO;

  constructor(private httpClient: HttpClient, private oss: OidcSecurityService, private router: Router) {
  }

  subscribeToUser(currentUserId: string, userIdToSubscribe: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`http://localhost:8080/api/user/subscribe/${userIdToSubscribe}`, null);
  }

  unsubscribeToUser(currentUserId: string, userIdToUnsubscribe: string): Observable<boolean> {
    return this.httpClient.post<boolean>(`http://localhost:8080/api/user/unsubscribe/${userIdToUnsubscribe}`, null);
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

  getUserProfile(userId: string): Observable<UserInfoDTO> {
    return this.httpClient.get<UserInfoDTO>(`http://localhost:8080/api/user/profile/${userId}`);
  }

  isSubscribed(userId: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`http://localhost:8080/api/user/is-subscribed/${userId}`);
  }


   registerUser() {
     this.oss.userData$.subscribe(userData => {
       this.oss.getAccessToken().subscribe(access => {
        //console.log("data " + JSON.stringify(access));
        if (access !== null) {
          this.httpClient.get("http://localhost:8080/api/user/register", { responseType: "text" })
            .subscribe(data => {
              this.userId = data;
              document.cookie = "uid=" + data;
              //console.log("In user Service, userId: "+this.userId);
              this.router.navigateByUrl('/featured');
            });
        }
      });
    });
   }

   getUserId(): string {
     //console.log("in get userId in user service, userId: "+this.userId);
     return this.userId;
   }

   idCheck(){
     const value = `; ${document.cookie}`;
     const parts = value.split(`; uid=`);
     //console.log("ran idCheck");
     if (parts.length === 2) {
       this.userId = parts.pop()!.split(';').shift()!;
     }
   }
 }
