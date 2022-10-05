import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss']
})
export class AdminHeaderComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  MasterManager(){
    this.router.navigate(['MasterAdmin']);
  }
  landingPageTracking(){
    this.router.navigate(['landingPageTracking']);
  }
  leadPageAdmin(){
    this.router.navigate(['leadpageAdmin']);
  }
  addVideo(){
    this.router.navigate(['addVideos']);
  }
}
