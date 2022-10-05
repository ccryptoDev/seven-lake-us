import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../_services';

@Injectable({
  providedIn: 'root'
})
export class AccessGuard implements CanActivate {

  constructor(private router: Router, private userService: UserService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let currentUser = JSON.parse(localStorage.getItem('currentUser'))
      //currentUser.userLevel = currentUser.userLevel.toString().toLowerCase();
      if(currentUser.userLevel.toLowerCase() == "a"){
        return true;
      } else{
        this.userService.showError("You don't have permissions")
        this.router.navigate(["/home"])
        return false;
      }
  }
  
}
