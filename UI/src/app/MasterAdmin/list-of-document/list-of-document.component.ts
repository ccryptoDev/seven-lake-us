import { Component, OnInit, } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Document } from 'src/app/types/document.type';
import { UserService } from 'src/app/_services';

@Component({
  selector: 'app-list-of-document',
  templateUrl: './list-of-document.component.html',
  styleUrls: ['./list-of-document.component.scss']
})
export class ListOfDocumentComponent implements OnInit {

  documentData: Document[] = [];
  searchText: string = '';
  page: number = 1;
  category = 'Date Upload';
  sortOptions = [
    { value: 'Date Upload', name: 'Date Upload' },
    { value: 'Name', name: 'Name', },
    { value: 'Category', name: 'Category', }
  ]

  constructor(
    private user: UserService,
    private router: Router,
    private toster: ToastrService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.user.listDocuments().subscribe(data => {
      this.documentData = data;

      if (this.documentData && this.documentData.length) {
        this.documentData.forEach((element, index) => {
          this.user.getFiles(element.Thumbnail_Link).subscribe((blob) => {
            if (blob.msg === 'Fail') {
              element.thumbnail = '../../../assets/images/office_manager_logo.png';
              return;
            }
            const objectUrl = URL.createObjectURL(new Blob([blob]));
            element.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
          });
        });
      }
    });
  }

  resetForm() {
    this.user.docmentadmin = '';
  }
  editDocument(data) {
    this.user.docmentadmin = data;
    this.router.navigate(['/adddocument']);
  }
  deleteDocument(id) {
    this.user.DeleteSingleDocument(id).subscribe(() => {
      this.toster.warning('your Data has Deleted');
      this.ngOnInit();
    });
  }
}
