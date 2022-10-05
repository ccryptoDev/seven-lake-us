import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordValidator } from '../_directives';
import { Title } from '@angular/platform-browser';
import { UserService } from '../_services';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.scss']
})
export class UserAuthComponent implements OnInit {
  item: any;
  data: any;
  item2: any;
  val: any;
  wrn: boolean = false;
  wrn2: boolean = false;
  userId: string;
  authForm: FormGroup;
  loading: boolean;
  submitted: boolean;
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private userService: UserService, private formBuilder: FormBuilder, private titleService: Title) { this.titleService.setTitle('FinanceAgents'); }

  ngOnInit(): void {
    this.userId = this.activatedRoute.snapshot.paramMap.get("id"); //   Get Id from query string
    if (this.router.url.includes('changepassword')) {
      this.authForm = this.formBuilder.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        passwordConfirmation: ['', [Validators.required, Validators.minLength(6)]],
      }, { validator: PasswordValidator });
    }
  }
  get f() { return this.authForm.controls; }

  getval(data: any) {
    console.log(data);
    this.item = data;
    if (((/[a-z]/).test(this.item) == true) && ((/[0123456789]/).test(this.item) == true) && (this.item.length >= 8)) {
      this.wrn = false;
      console.log("pass");
    }
    else {
      this.wrn = true;
      console.log("fail");
    }
    return this.wrn;
  }

  onSubmit() {
    if (this.authForm.invalid) {
      this.userService.showError("Please fill mandatory fields");
      return;
    }
    const params = {
      userId: this.userId,
      newPassword: this.authForm.value.password
    }
    this.userService.resetPassword(params)
      .pipe(first())
      .subscribe(
        data => {
          this.clearForm();
          this.router.navigate(['/login']);
          this.userService.showSuccess('Your password has been reset!');
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
    this.authForm.reset();
    this.submitted = false;
  }

  confirmpass(val: any) {
    console.log(val);
    console.log(this.item);
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
