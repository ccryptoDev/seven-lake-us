import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { PasswordValidator } from '../../_directives';
import { AuthenticationService, UserService } from "../../_services";
import { Md5 } from "ts-md5/dist/md5";
import { first } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [Md5]
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;
  submitted = false;
  resetToken: string = '';
  loading: boolean = false;

  constructor(private formBuilder: FormBuilder, public router: Router, private route: ActivatedRoute, private authenticationService: AuthenticationService, private userService: UserService,
    private titleService: Title) {
    this.titleService.setTitle('FinanceAgents')
  }

  ngOnInit(): void {
    this.resetToken = this.route.snapshot.paramMap.get("id"); //   Get Id from query string
    if (this.router.url == '/user/forgotPassword') {
      // alert(12345);
      this.forgotForm = this.formBuilder.group({
        emailId: ["", [Validators.required, Validators.pattern(environment.emailPattern)]]
      });
    } else {
      // alert(123);
      this.forgotForm = this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        passwordConfirmation: ['', [Validators.required, Validators.minLength(6)]],
      }, { validator: PasswordValidator });
    }
  }
  onSubmitForgot() {
    this.submitted = true;
    if (this.forgotForm.invalid) {
      return;
    }
    this.loading = false;
    this.userService.getRequestForgotPassword(`​/User​/forgotPassword`, this.forgotForm.value.emailId.toLowerCase())
      .pipe(first())
      .subscribe(
        data => {
          this.clearForm();
          this.router.navigate(['/login']);
          this.userService.showSuccess('You will receive an email with instructions on how to reset your password in a few minutes');
        }, error => {
          this.loading = false;
          this.submitted = false;
          if (error.error)
            this.userService.showError(error.error);
          else
            this.userService.showError(error.message);
        }
      );
  }
  clearForm() {
    this.loading = false;
    this.forgotForm.reset();
    this.submitted = false;
  }
  onSubmitReset() {
    this.submitted = true;
    if (this.forgotForm.invalid) {
      return;
    }
    this.loading = true;
    // this.resetToken = 'btcje8mc/my=';
    let newPassword = Md5.hashStr(this.forgotForm.value.password);
    let param = {
      reset_token: this.resetToken,
      password: newPassword
    }
    this.userService.postReqestSaveUser(param, "/User/resetPassword")
      .pipe(first())
      .subscribe(
        data => {
          this.clearForm();
          if (data['result'] == 'Success') {
            this.router.navigate(['/']);
            this.userService.showSuccess('Your password has been changed successfully!');
          } else {
            this.userService.showError('Your password has not been changed!');
          }
        }, error => {
          this.loading = false;
          this.submitted = false;
          if (error.error)
            this.userService.showError(error.error);
          else
            this.userService.showError(error.message);
        }
      );
  }
  get f() { return this.forgotForm.controls; }
}
