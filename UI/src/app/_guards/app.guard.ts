import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../_services';
import { User } from '../_models';
import { Subscription } from 'rxjs';

// Used globally everywhere besides login / signup
// to redirect users back in case they are not authenticated;
// Opposite of LoginGuard
@Injectable({ providedIn: 'root' })
export class AppGuard implements CanActivate {
	currentUser: User;
	currentUserSubscription: Subscription;

	constructor(
		private router: Router,
		private authService: AuthenticationService
	) {
		this.currentUserSubscription = this.authService.currentUser.subscribe((x) => {
			this.currentUser = x;
		});
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		const serviceUser = this.authService.currentUserValue;
		const storageUser = localStorage.getItem('currentUser');
		if (!serviceUser && !storageUser) {
			this.router.navigate(['/register'])
			return false
		}
		return true;
	}
}