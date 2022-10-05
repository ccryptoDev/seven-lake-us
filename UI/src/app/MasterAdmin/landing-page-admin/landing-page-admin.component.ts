import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { LandingPage } from 'src/app/types/landingPage.type';
import { LandinPageService } from 'src/app/_services/landingpage.service';
import { LandingPageForm } from './landing-page-form/landing-page-form.component';

export interface PeriodicElement {
  name: string;
  usedBy: string;
  status: string;
  useInRandon: string;
}

type LandingPageWithDisplay = LandingPage & {
  display: string;
}

@Component({
  selector: 'app-landing-page-admin',
  templateUrl: './landing-page-admin.component.html',
  styleUrls: ['./landing-page-admin.component.scss']
})
export class LandingPageAdminComponent implements OnInit {

  landingPage = 1;
  audiencePage = 1;
  sortBy = 'Name'

  pages: LandingPageWithDisplay[] = [];
  audiencePages: LandingPageWithDisplay[] = [];
  fileList: File;

  rangeForm = new FormGroup({
    start: new FormControl(new Date()),
    end: new FormControl(new Date())
  })

  @ViewChild('landingForm') landingForm: LandingPageForm;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: PeriodicElement,
    private landingService: LandinPageService,
    private toster: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadPages().then(() => {
      let startDate, endDate
      for (let page of this.pages) {
        if (!startDate || new Date(page.createdAt) < startDate) {
          startDate = new Date(page.createdAt)
        }
        if (!endDate || new Date(page.createdAt) > endDate) {
          endDate = new Date(page.createdAt)
        }
      }
      this.rangeForm.patchValue({ start: startDate, end: endDate })
    });
  }

  loadPages = async () => {
    const landings = await this.landingService.getLandingPages().toPromise()
    this.pages = landings.map(page => ({
      ...page,
      display: page.status === 'Active' ? 'Deactivate' : 'Activate'
    }));
    this.pages.sort((a, b) => {
      return new Date(a.createdAt) <= new Date(b.createdAt) ? 1 : -1
    })
    this.audiencePages = Array.from(this.pages)
  }

  editPage(page: LandingPage) {
    this.landingForm.open(page)
  }

  addPage(): void {
    this.landingForm.open()
  }

  closePageModal(): void {
    this.landingForm.close()
  }

  toggleActive(item: LandingPageWithDisplay) {
    var param = {
      status: item.status
    }

    param.status = 'InActive';
    if (item.display === 'Activate') {
      param.status = 'Active';
    }

    this.landingService.updateLandingPage(param, item.id).subscribe(() => {
      this.toster.success("Updated successfully");
      this.loadPages();
    });
  }
}
