import { Component } from '@angular/core';
import {OidcSecurityService} from "angular-auth-oidc-client"
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  isAuthenticated: boolean = false;
  constructor(private oidcSecurityService: OidcSecurityService, private router: Router){

  }

  ngOnInit(): void{
    this.oidcSecurityService.isAuthenticated$.subscribe(({isAuthenticated}) => {
        this.isAuthenticated = isAuthenticated;
    })
  }

  home(){
    this.router.navigateByUrl('/featured');
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoffAndRevokeTokens();
    this.oidcSecurityService.logoffLocal();

  }
}
