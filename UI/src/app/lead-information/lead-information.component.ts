import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../_services';
import { leadInformation } from './leadInformation';

@Component({
  selector: 'app-lead-information',
  templateUrl: './lead-information.component.html',
  styleUrls: ['./lead-information.component.scss']
})
export class LeadInformationComponent implements OnInit {
  loading = true;
  page = 1;
  informationData: any[] = [];
  displayedColumns: string[] = ['id', 'Lead_Status', 'Credit_Score', 'Average_Bank_Balance', 'Lead_Source', 'Email', 'First_Name', 'Phone', 'URL'];
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  zohoLeadInformation = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe(() => {
      if (!this.userService.userDetails || !this.userService.token) {
        this.userService.getZohoToken().subscribe((response) => {
          this.userService.token = response.tokenResponse.access_token;
          this.userService.getAgentsByEmail().subscribe((result) => {
            if (result && result.agent && result.agent.length) {
              this.userService.userDetails = result.agent[0];
              const userData = this.userService.userDetails;
              localStorage.setItem('UserDetails', JSON.stringify(userData));
              this.getLeadInformation();
            }
          });
        });
      } else if (this.userService.userDetails && this.userService.userDetails.Member_Number) {
        this.getLeadInformation();
      }
    });
  }

  getLeadInformation() {
    this.userService.listLeads(this.userService.userDetails.Member_Number).subscribe(data => {
      this.dataSource = new MatTableDataSource<leadInformation>(data.lead);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.zohoLeadInformation = data.lead;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.toastr.error('Lead Information Is Not Available');

    });
  }

  editLeads(data: any) {
    this.userService.leadsData = data;
  }

}
