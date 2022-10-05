import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
export interface PeriodicElement {
  Party: string;
  url: string;
  Status: string;
  ID:string;
  Name: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {url: 'www.google.com', Party: 'Hydrogen Party ', Status: 'Active', ID:'1989082',Name: 'sadique '},
  {url: 'www.yahoo.com', Party: 'Helium Party', Status: 'InActive', ID:'24564545',Name: 'shafi'},
  {url: 'www.duckduckgo.com', Party: 'Lithium Party', Status: 'Active', ID:'145454',Name: 'john'},
  {url: 'www.facbook.com', Party: 'Beryllium Party', Status: 'InActive', ID:'1456445',Name: 'Duse'},
  {url: 'www.instagram.com', Party: 'Boron Party', Status: 'InActive', ID:'146545',Name: 'tony'},
  {url: 'www.twitter.com', Party: 'Carbon Party', Status: 'InActive', ID:'15657567',Name: 'stark'},
  {url: 'www.email.com', Party: 'Nitrogen Party', Status: 'Active', ID:'167567',Name: 'blue'},
  {url: 'www.outlook.com', Party: 'Oxygen Party', Status: 'off', ID:'1656456',Name: 'delta'},
  {url: 'www.messeger.com', Party: 'Fluorine Party', Status: 'Active', ID:'1546',Name: 'Force'},
  {url: 'www.angular.com', Party: 'Neon Party', Status: 'InActive', ID:'1756767',Name: 'good'},
];
@Component({
  selector: 'app-master-admin',
  templateUrl: './master-admin.component.html',
  styleUrls: ['./master-admin.component.scss']
})
export class MasterAdminComponent implements OnInit {
  displayedColumns: string[] = ['url', 'Party', 'Status', 'Name','ID','Action'];
  dataSource =new MatTableDataSource(ELEMENT_DATA) ;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor() { }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  ngOnInit(): void {}

}
