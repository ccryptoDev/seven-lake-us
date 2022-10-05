import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../_services';
import { User } from '../_models';
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    currentUser: User;
    currentUserSubscription: Subscription;
    favIcon: HTMLLinkElement = document.querySelector('#appfavicon');
    constructor(private router: Router,
        private authenticationService: AuthenticationService) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe((x) => {
            this.currentUser = x;
        });
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        // if (localStorage.getItem('currentUser')) {
        //     // logged in so return true
        //     this.getCompanyDetails();
        //     return true;
        // }
        if (currentUser) {
            // check if route is restricted by role
            if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
                // role not authorised so redirect to home page
                this.router.navigate(['/']);
                return false;
            }
            // authorised so return true
            return true;
        }
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}