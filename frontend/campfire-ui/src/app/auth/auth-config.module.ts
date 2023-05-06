import { NgModule } from '@angular/core';
import { AuthModule } from 'angular-auth-oidc-client';


@NgModule({
    imports: [AuthModule.forRoot({
        config: {
            authority: 'https://dev-qhma45uz2xelxp4k.us.auth0.com',
            redirectUrl: window.location.origin,
            clientId: 'xIDatbAYqwGMjwsoXPtvpzMAPpMwbq23',
            scope: 'openid profile offline_access',
            responseType: 'code',
            silentRenew: true,
            useRefreshToken: true,
        }
      })],
    exports: [AuthModule],
})
export class AuthConfigModule {}
