import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../_services';
import { User } from '../_models';
import { Subscription } from 'rxjs';


// Used in login / signup pages for redirecting users to
// application once they are authenticated;
// Opposite of AppGuard
@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
	currentUser: User;
	currentUserSubscription: Subscription;

	constructor(
		private router: Router,
		private authenticationService: AuthenticationService) {
		this.currentUserSubscription = this.authenticationService.currentUser.subscribe((x) => {
			this.currentUser = x;
		});
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		const currentUser = this.authenticationService.currentUserValue;
		if (currentUser) {
			this.router.navigate(['/home'])
			return false
		}
		return true;
	}
}