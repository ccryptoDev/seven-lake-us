import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-landing-page-tracking',
  templateUrl: './landing-page-tracking.component.html',
  styleUrls: ['./landing-page-tracking.component.scss']
})
export class LandingPageTrackingComponent implements OnInit {
 
  campaignOne: FormGroup;
  campaignTwo: FormGroup;
  constructor(){
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    this.campaignOne = new FormGroup({
      start: new FormControl(new Date(year, month, 13)),
      end: new FormControl(new Date(year, month, 16)),
    });
    this.campaignTwo = new FormGroup({
      start: new FormControl(new Date(year, month, 15)),
      end: new FormControl(new Date(year, month, 19)),
    });
  }
  ngOnInit(): void {}

}
