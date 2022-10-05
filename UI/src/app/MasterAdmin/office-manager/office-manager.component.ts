import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/_services';

@Component({
  selector: 'app-office-manager',
  templateUrl: './office-manager.component.html',
  styleUrls: ['./office-manager.component.scss']
})
export class OfficeManagerComponent implements OnInit {

  example1 = [
    // { make: 'Toyota', model: 'Celica', price: 35000 },
    // { make: 'Ford', model: 'Mondeo', price: 32000 },
    // { make: 'Porsche', model: 'Boxter', price: 72000 }
  ];

  constructor(private getOfficeData: UserService, private sanitizer: DomSanitizer) {

  }

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    this.getOfficeData.getOfficeData().subscribe(res => {
      console.log(res);
      this.example1 = res.getOffice;
      if (this.example1 && this.example1.length) {
        this.example1.forEach((element, index) => {
          this.getOfficeData.getFiles(element.OfficeLogo).subscribe((blob) => {
            if (blob.msg === 'Fail') {
              element.thumbnail = "../../../assets/images/office_manager_logo.png";
              return;
            }
            const objectUrl = URL.createObjectURL(new Blob([blob]))
            element.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
          })
        });
      }
    })
  }
}
