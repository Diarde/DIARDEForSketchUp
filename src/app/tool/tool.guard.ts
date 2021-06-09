import { CanActivate, UrlSegment, Route,  Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree  } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Injectable, Inject } from '@angular/core';

@Injectable()
export class ToolGuard implements CanActivate {

    constructor(private router: Router,
                private authSerive: AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot): Promise<boolean|UrlTree> {
            return new Promise((resolve, reason) => {
                if (!this.authSerive.getLogin()) {
                    // this.router.navigate(['/login']);
                    resolve(this.router.parseUrl('/login'));
                    return;
                }
                resolve(true);
            });
    }

}
