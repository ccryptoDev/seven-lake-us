import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from "../../environments/environment";

import { Router } from "@angular/router";
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { User } from '../_models';
import {
    UserService
} from "../_services/user.service";
import { ToastrService } from 'ngx-toastr';
@Injectable({ providedIn: "root" })
export class AuthenticationService {
    apiURL: string;
    lodding: false;
    public currentUserSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
    public MenuHideAndShowObject: BehaviorSubject<any>;
    public MenuHideAndShow: Observable<boolean>;

    public isExpandMenuObject: BehaviorSubject<any>;
    public isExpandMenu: Observable<boolean>;

    public currentUser: Observable<User>;
    constructor(
        private http: HttpClient,
        private router: Router,
        private userService: UserService,
        private toastr: ToastrService
    ) {
        this.apiURL = environment.APIUrl;
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();

        this.MenuHideAndShowObject = new BehaviorSubject<any>([]);
        this.MenuHideAndShow = this.MenuHideAndShowObject.asObservable();

        this.isExpandMenuObject = new BehaviorSubject<boolean>(true);
        this.isExpandMenu = this.isExpandMenuObject.asObservable();
    }


    hideAndShowMenu(val) {
        this.MenuHideAndShowObject.next([{ hideAndShow: val }]);
    }

    buttonSectionExpand(val: boolean) {
        this.isExpandMenuObject.next(val);
    }

    async getToken() {
        const response = await this.userService.getZohoToken().toPromise()
        return response.tokenResponse.access_token;
    }

    async login(email: string, password: string) {
        this.userService.token = await this.getToken()
        const user = await this.http.post<any>(`${this.apiURL}/api/auth/login`, { email, password }).toPromise()
        if (user?.token) {
            const result = await this.userService.getAgentsByEmail(user.email).toPromise()
            const agent = result.agent?.[0]
            if (!agent) {
                throw new Error('Failed to log in')
            }
            return agent;
        }
        throw new Error('Failed to log in')
    }

    async isEmailTaken(email: string, token?: string): Promise<boolean> {
        if (!token) token = await this.getToken()
        const response = await this.userService.getAgentsByEmail(email, token).toPromise()
        return response?.agent?.length > 0
    }

    async getSponsor(sponsorId: string, token?: string) {
        if (!token) token = await this.getToken()
        const response = await this.userService.getAgentsByMemberCode(sponsorId, token).toPromise()
        return response?.agent?.[0] || null
    }

    async signup(user: User, token?: string) {
        if (!token) token = await this.getToken()
        user.name = `${user.firstName} ${user.lastName}`;
        user.company = 'Test Company';
        return await this.http.post(`${this.apiURL}/api/auth/signup`, user, { params: { code: token } }).toPromise()
    }

    public get currentUserValue() {
        return this.currentUserSubject.value;
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('UserDetails');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('expiresIn');
        this.currentUserSubject.next(null);
    }

    public updatedLocalStorage(data) {
        this.currentUserSubject.next(data);
    }

    handleError(error) {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
            // Get client-side error
            errorMessage = error.error.message;
        } else {
            // Get server-side error
            errorMessage = error.error.msg;
        }
        return throwError(errorMessage);
    }
}
