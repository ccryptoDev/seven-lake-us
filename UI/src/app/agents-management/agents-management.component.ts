import { Component, OnInit, ViewChild } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AgentInterface } from './agentdata';
import {UserService} from '../_services/user.service'
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agents-management',
  templateUrl: './agents-management.component.html',
  styleUrls: ['./agents-management.component.scss']
})
export class AgentsManagementComponent implements OnInit {
  // AgentInformation: AgentInterface[]=[];
  displayedColumns: string[] = ['id','Agent_First','Agent_Last','Email', 'Company', 'Website','Last_Activity_Time', 'Action'];
  dataSource:MatTableDataSource<AgentInterface>;
  //  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  p:any;
  a:string;
  loading = true;
  selection = new SelectionModel<AgentInterface>(true, []);
  searchitem:any[]=[];
  public searchToken:any;
  order: string = 'FName';
  constructor(private service:UserService, private toastr: ToastrService,private router:Router) { 

  }
  ngOnInit(): void {
    this.a = this.service.token;
    this.getagentmanagerdata();
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = !!this.dataSource && this.dataSource.data.length;
    return numSelected === numRows;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editAgent(data:any){
    this.service.agentDetails = data;
    this.router.navigate(['/edit-agent']);
    
  }
  getagentmanagerdata(){
    this.service.getAgentData(this.a).subscribe(res=>{
      this.dataSource = new MatTableDataSource(res.agents);
     this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.dataSource.filteredData);
      
    }, error => {
      this.toastr.error('agent Information Is Not Available');

    })
  }
 

}
