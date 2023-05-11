import { NgModule } from '@angular/core';
import { AuthModule } from 'angular-auth-oidc-client';


@NgModule({
    imports: [AuthModule.forRoot({
        config: {
            authority: 'https://dev-qhma45uz2xelxp4k.us.auth0.com',
            //redirectUrl: window.location.origin, // maybe double check this later to be sure it is actually the problem
            redirectUrl: "http://localhost:4200/callback",
            clientId: 'xIDatbAYqwGMjwsoXPtvpzMAPpMwbq23',
            scope: 'openid profile offline_access email',
            responseType: 'code',
            silentRenew: true,
            useRefreshToken: true,
            secureRoutes:['http://localhost:8080'],
            customParamsAuthRequest: {
              audience: 'http://localhost:8080'
            },
        }
      })],
    providers: [],
    exports: [AuthModule],
})
export class AuthConfigModule {}
