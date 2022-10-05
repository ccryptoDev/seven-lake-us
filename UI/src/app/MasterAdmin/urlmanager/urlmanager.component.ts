import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { ManagedURL } from 'src/app/types/managedURL.type';
import { ManagedURLService } from 'src/app/_services/managed-url.service';


@Component({
  selector: 'app-urlmanager',
  templateUrl: './urlmanager.component.html',
  styleUrls: ['./urlmanager.component.scss']
})
export class URLManagerComponent implements OnInit {
  currentPage: number = 1;
  urls: ManagedURL[] = [];
  ownerOptions = ["Owned by FA", "Hold for Branding"];
  dataSource = new MatTableDataSource<ManagedURL>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor( 
    private urlService: ManagedURLService,
    private tostr: ToastrService
  ) { }

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

  changeCategory(event, id: string, index: number) {
    this.urlService.updateUrl(id, { owner: event.target.value }).subscribe(() => {
      this.tostr.success('Owner information updated');
      this.dataSource.filteredData[index].owner = event.target.value;
    })
  }

  updateURL = (id: string, values: string[]) => {
    this.urlService.updateUrl(id, { urls: values }).subscribe(() => {
      const item = this.urls.find(item => item.id === id)
      item.urls = values
    })
  }


  ngOnInit(): void {
    this.fetchList();
  }

  fetchList() {
    this.urlService.listUrl().subscribe(urls => {
      this.urls = urls;
      this.dataSource = new MatTableDataSource<ManagedURL>(urls);
      this.dataSource.paginator = this.paginator;
    })
  }

  deleteURL(id: string) {
    this.urlService.deleteUrl(id).subscribe(() => {
      this.tostr.warning('Data removed successfully');
      this.fetchList();
    })
  }
}