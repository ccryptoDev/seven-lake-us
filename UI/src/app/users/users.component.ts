import { IconsModule } from 'angular-bootstrap-md';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { first } from 'rxjs/operators';
import { AlertService } from './../_services/alert.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Md5 } from 'ts-md5/dist/md5';
import {
  AuthenticationService,
  UserService,
} from "./../_services";
import { User } from "./../_models";
import { Title } from "@angular/platform-browser";
import { environment } from "../../environments/environment";
import { PasswordValidator } from '../_directives';
import { JsonPipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { isBuffer } from 'util';
import { Sort } from '@angular/material/sort';



@Component({
  selector: 'app',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [Md5]
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = [
    "sno",
    "firstname",
    "lastname",
    "email",
    "editor",
    "account",
    "action",

  ];
  userExpand = false;
  newExpand = false;
  editExpand = false;
  currentUser: User;
  allUserDetails: any = [];
  newUserForm: FormGroup;
  loading = false;
  edit = false;
  submitted = false;
  allCompanyDetails: any = [];
  userId: number = 0;
  userDetails: any = {};
  prevPassword: string = '';
  userRole: any = [{ displayName: 'Admin', value: "admin" },
  { displayName: 'Super Admin', value: "superadmin" },
  { displayName: 'User', value: "user" }
  ];
  userStatus: any = [
    { displayName: 'Active', value: 1 },
    { displayName: 'Paused', value: 2 },
    { displayName: 'Froze', value: 3 },
    { displayName: 'Blocked', value: 4 }
  ];
  newUserStatus: any = [{ displayName: 'Active', value: 1 }]
  allMarketDetails: any = [];
  emailPattern = environment.emailPattern;
  gridAction: string = '';
  superadmin_id: number;
  first_name: string;
  last_name: string;
  allRegionDetails: any = [];
  tableDataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private titleService: Title,
    private el: ElementRef,
  ) {
    this.authenticationService.currentUser.subscribe((x) => {
      this.currentUser = x;
    });
  }

  ngOnInit(): void {
  }


}
