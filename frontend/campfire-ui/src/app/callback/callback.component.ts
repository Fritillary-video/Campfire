import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent {

  constructor(
    private userService: UserService,
    private router: Router,
    private oidcSecurityService: OidcSecurityService
  ) {
    this.oidcSecurityService.checkAuth().subscribe(({ isAuthenticated, accessToken }) => {
      if (isAuthenticated) {
        this.userService.registerUser(accessToken);
        this.router.navigateByUrl('');
      }
    });
  }

  ngOnInit(): void {}
}
