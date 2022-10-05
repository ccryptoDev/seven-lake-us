import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userDetails:any  = '';
  
  constructor() { }

  ngOnInit(): void {
    this.userDetails = JSON.parse(localStorage.getItem('UserDetails'));
  
  }
}
