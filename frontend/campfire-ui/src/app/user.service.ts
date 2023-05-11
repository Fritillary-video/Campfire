import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { OidcSecurityService } from 'angular-auth-oidc-client';

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
