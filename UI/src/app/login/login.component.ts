import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Md5 } from "ts-md5/dist/md5";

import { AuthenticationService, UserService } from '../_services';
import { User } from './../_models';
import { Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import ResetPasswordComponent from "./reset-password/reset-password.component";

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  providers: [Md5],
})
export class LoginComponent implements OnInit {
  email: AbstractControl;
  password: AbstractControl;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  currentUser: User;
  isForgotPassword: boolean = false;
  showPassword = false;
  item: any;
  data: any;
  item2: any;
  val: any;
  wrn: boolean = false;
  wrn2: boolean = false;
  error = '';
  fieldTextType: boolean;

  @ViewChild(ResetPasswordComponent) passwordModal: ResetPasswordComponent

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private titleService: Title,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.titleService.setTitle('FinanceAgents');
    this.authenticationService.currentUser.subscribe((x) => {
      this.currentUser = x;
    });
  }

  openPasswordModal() {
    this.passwordModal.open()
  }

  ngOnInit() {
    let linkedinCode = this.route.snapshot.queryParamMap.get('code'); //   Get LinkedIn Code from query string
    let stateCode = this.route.snapshot.queryParamMap.get('state'); //   Get LinkedIn StateCode from query string
    if (linkedinCode && stateCode) {
    } else {
      if (this.currentUser != null) this.router.navigate(['/home']);
    }
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(environment.emailPattern)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid && (this.f.email.value === "" || this.f.password.value === '')) {
      this.userService.showError("Please enter email id and password");
      return;
    } else if (this.loginForm.invalid) {
      this.userService.showError("Please check the errors");
      return;
    }
    this.loading = true;
    this.authenticationService.login(this.f.email.value, this.f.password.value).then(user => {
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user.Email));
        localStorage.setItem('UserDetails', JSON.stringify(user));

        this.userService.userDetails = user
        this.authenticationService.currentUserSubject.next(user);

        this.toastr.success('Successfully Login');
        this.router.navigate(['home']);
      } else {
        this.loading = false;
        this.toastr.error('Invalid user name or password');
      }
    }, () => {
      this.toastr.error('Invalid user name or password');
    });
  }

  getval(data: any) {
    this.item = data;
    if (((/[a-z]/).test(this.item) == true) && ((/[0123456789]/).test(this.item) == true) && (this.item.length >= 8)) {
      this.wrn = false;
    }
    else {
      this.wrn = true;
    }
    return this.wrn;
  }
  confirmpass(val: any) {
    this.item2 = val;
    if (this.item === this.item2) {
      this.wrn2 = false;
    }
    else {
      this.wrn2 = true;
    }
    return this.wrn;
  }

}
