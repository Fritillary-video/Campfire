import { Component, Input } from '@angular/core';
import { OidcSecurityService } from "angular-auth-oidc-client"
import { Router } from "@angular/router";
import { UserService } from '../user.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Input()
  searchFromHeader : string = "";
  isAuthenticated: boolean = false;
  inputValue!: FormControl;

  constructor(private oidcSecurityService: OidcSecurityService, private router: Router, private userService: UserService) {
  }

  ngOnInit(): void {
    this.oidcSecurityService.isAuthenticated$.subscribe(({ isAuthenticated }) => {
      this.isAuthenticated = isAuthenticated;
      this.inputValue = new FormControl('');
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

  headerSearch(){
   this.router.navigateByUrl('/search/'+this.inputValue.value);
   this.inputValue.reset();
  }
}
