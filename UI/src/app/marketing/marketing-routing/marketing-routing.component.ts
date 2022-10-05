import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-marketing-routing',
  templateUrl: './marketing-routing.component.html',
  styleUrls: ['./marketing-routing.component.scss']
})
export class MarketingRoutingComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

}
