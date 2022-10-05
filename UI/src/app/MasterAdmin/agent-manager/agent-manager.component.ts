import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AgentInterface } from './agentdata';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { UserService } from 'src/app/_services'

@Component({
  selector: 'app-agent-manager',
  templateUrl: './agent-manager.component.html',
  styleUrls: ['./agent-manager.component.scss']
})
export class AgentManagerComponent implements OnInit {
  searchText: string;
  dataSource: MatTableDataSource<AgentInterface>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  page: number = 1;
  loading = true;
  selection = new SelectionModel<AgentInterface>(true, []);
  agents: any[];

  constructor(
    private service: UserService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getagentmanagerdata();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = !!this.dataSource && this.dataSource.data.length;
    return numSelected === numRows;
  }

  editAgent(data: any) {
    this.service.agentDetails = data;
    this.router.navigate(['/edit-agent']);
  }

  getagentmanagerdata() {
    this.service.getAgentData(this.service.token).subscribe(res => {
      this.agents = res.agents;
      this.dataSource = new MatTableDataSource(res.agents);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.dataSource.filteredData);

    }, () => {
      this.toastr.error('agent Information Is Not Available');
    })
  }
}
