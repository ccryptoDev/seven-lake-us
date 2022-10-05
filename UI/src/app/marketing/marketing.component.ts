import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Document } from '../types/document.type';
import { UserService } from '../_services';
@Component({
  selector: 'app-marketing',
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.scss']
})
export class MarketingComponent implements OnInit {
  data: Document[];

  constructor(
    private user: UserService,
    private sanitizer: DomSanitizer,
    private tostr: ToastrService
  ) { }

  ngOnInit(): void {
    this.fetchDetails();
  }

  fetchDetails() {
    this.user.listDocuments('Email Template').subscribe(response => {
      this.data = response;
      if (this.data && this.data.length) {
        this.data.forEach((element, index) => {
          this.user.getFiles(element.Thumbnail_Link).subscribe((blob) => {
            const objectUrl = URL.createObjectURL(new Blob([blob]))
            element.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
          });
          this.user.getFiles(element.Document_Link).subscribe((blob) => {
            const objectUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' })) + '#toolbar=0&navpanes=0';
            element.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
          });
        });
      }
    })
  }

  editdata(id: string) {
    this.user.docmentadmin = id;
  }

  deleteItem(id: string) {
    this.user.DeleteSingleDocument(id).subscribe(res => {
      this.fetchDetails()
      this.tostr.warning('Your data was deleted successfully');
    })
  }
}
