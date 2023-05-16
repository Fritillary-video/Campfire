import { Component } from '@angular/core';
import { OidcSecurityService } from "angular-auth-oidc-client"
import { Router } from "@angular/router";
import { UserService } from '../user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  isAuthenticated: boolean = false;
  constructor(private oidcSecurityService: OidcSecurityService, private router: Router, private userService: UserService) {
  }

  ngOnInit(): void {
    this.oidcSecurityService.isAuthenticated$.subscribe(({ isAuthenticated }) => {
      this.isAuthenticated = isAuthenticated;
    })
  }

  home() {
    this.router.navigateByUrl('/featured');
  }

  login() {
    this.oidcSecurityService.authorize();
    // const userData = this.oidcSecurityService.getUserData();
    // console.log('User Data:', userData);
  }

  logout() {
    this.oidcSecurityService.logoffAndRevokeTokens();
    this.oidcSecurityService.logoffLocal();
  }

  profile() {
    this.router.navigateByUrl('/my-profile');
  }

}
