import {  HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl : string = "http://localhost:8080";
  private userId : string = '';
  private accessToken: string = ''; // Add this line

  constructor(private httpClient : HttpClient) { }

  subscribeToUser(userId : string) : Observable<Boolean>{
    return this.httpClient.post<Boolean>(this.apiUrl + "/api/user/subscribe/" + userId , null);
  }

  registerUser(accessToken: string) { // Add the accessToken parameter
    this.accessToken = accessToken; // Store the access token
    this.httpClient.get<string>(this.apiUrl+"/api/user/register").subscribe(data => {
      this.userId = data;
    });
  }

  getUserId() : string{
    return this.userId;
  }

  getAccessToken(): string { // Add this method to retrieve the access token
    return this.accessToken;
  }
}

