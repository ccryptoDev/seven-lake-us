import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/_services';
import { ToastrService } from 'ngx-toastr';
import { LandinPageService } from 'src/app/_services/landingpage.service';
import { ActivatedRoute } from '@angular/router';
import { MAX_DOCUMENT_SIZE } from 'src/app/constants/maxDocumentSize';

const BULLET_FIELDS = 5;
@Component({
  selector: 'app-add-office',
  templateUrl: './add-office.component.html',
  styleUrls: ['./add-office.component.scss']
})
export class AddOfficeComponent implements OnInit {
  form: FormGroup;
  WelcomeEmailTemplate = ['AAM Default', 'Google', 'Yahoo'];
  ListOfVideo: any;
  ListOfImages: any
  fileList: any[] = [];
  selectedLevelforAAMD = 'Standard';
  selectedLevelForLanding = 'Choose your landing page';
  selectedLevelForEmail = 'Executive';

  isEditForm = false;
  officeId: string;

  landingPages = [];

  AAMLevels = [
    { id: 1, name: "Standard" },
    { id: 2, name: "Good" },
    { id: 3, name: "Executive" },
    { id: 4, name: "Office" },
    { id: 5, name: "AAM Internal" },
    { id: 6, name: "Admin" }
  ];

  emailTemplates = [
    { id: 1, name: "Standard" },
    { id: 2, name: "Good" },
    { id: 3, name: "Executive" },
    { id: 4, name: "Office" },
    { id: 5, name: "AAM Internal" },
    { id: 6, name: "Admin" }
  ];

  selectedFile: File;
  bannerName: string;

  constructor(
    private location: Location,
    private landingService: LandinPageService,
    private fb: FormBuilder,
    private user: UserService,
    private toster: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.landingService.getLandingPages().subscribe((data) => {
      this.landingPages = data.map(({ id, name }) => ({
        id, name
      }));
    })

    const bulletPoints = {}
    for (let i = 1; i <= BULLET_FIELDS; i++) {
      bulletPoints[`bulletPoint-${i}`] = ['']
    }

    this.form = this.fb.group({
      Name: [],
      AAMDefault: [''],
      LandingPageDefault: [''],
      WelcomeEmailTemplate: [''],
      CompanyInformation: [''],
      ApplyPathDomain: [''],
      Address: [''],
      OfficePhone: [''],
      MobilePhone: [''],
      SingleQuestionHeader: [''],
      OfficeDescription: [''],
      landingPageTextColor: [''],
      subHeaderH2: [''],
      teamspollicyAgrements: [''],
      bannerBackgroundColor: [''],
      startHereTextColor: [''],
      aboutUsTextColor: [''],
      footer: [''],
      ctaButtonsTextolor: [''],
      ...bulletPoints
    })

    this.route.queryParams.subscribe(params => {
      if (params?.officeId) {
        this.isEditForm = true
        this.officeId = params?.officeId
        this.getSingleOffice(params?.officeId);
      }
    })
  }

  getSingleOffice(officeId: string) {
    this.user.getSingleOffice(officeId).subscribe(data => {
      this.form.get("Name").setValue(data.getOffice.Name);
      this.form.get("CompanyInformation").setValue(data.getOffice.CompanyInformation);
      this.form.get("ApplyPathDomain").setValue(data.getOffice.ApplyPathDomain);
      this.form.get("Address").setValue(data.getOffice.Address);
      this.form.get("OfficePhone").setValue(data.getOffice.OfficePhone);
      this.form.get("MobilePhone").setValue(data.getOffice.MobilePhone);
      this.form.get("SingleQuestionHeader").setValue(data.getOffice.SingleQuestionHeader);
      this.form.get("OfficeDescription").setValue(data.getOffice.OfficeDescription);
      this.form.get("landingPageTextColor").setValue(data.getOffice.landingPageTextColor)
      this.form.get("subHeaderH2").setValue(data.getOffice.subHeaderH2)
      this.form.get("teamspollicyAgrements").setValue(data.getOffice.teamspollicyAgrements)
      this.form.get("bannerBackgroundColor").setValue(data.getOffice.bannerBackgroundColor)
      this.form.get("startHereTextColor").setValue(data.getOffice.startHereTextColor)
      this.form.get("aboutUsTextColor").setValue(data.getOffice.aboutUsTextColor)
      this.form.get('footer').setValue(data.getOffice.footer)
      this.form.get('AAMDefault').setValue(data.getOffice.AAMDefault || '')
      this.form.get('LandingPageDefault').setValue(data.getOffice.LandingPageDefault || '')
      this.form.get('WelcomeEmailTemplate').setValue(data.getOffice.WelcomeEmailTemplate)

      const bulletPoints = data.getOffice.bulletPoints
      for (let i = 1; i <= BULLET_FIELDS; i++) {
        const fieldValue = bulletPoints?.[i - 1] || ''
        this.form.get(`bulletPoint-${i}`).setValue(fieldValue)
      }

      this.bannerName = data.getOffice.OfficeLogo;
    }, () => {
      this.isEditForm = false
      this.toster.error("Office not found")
    })
  }

  onFileChanged(event) {
    const file = event.target.files && event.target.files[0];
    this.ListOfVideo = file;
    for (var i = 0; i < event.target.files.length; i++) {
      this.selectedFile = event.target.files[i];
      this.bannerName = this.selectedFile.name;
    }
  }

  onFileDropped($event) {
    if ($event['0'].size >= MAX_DOCUMENT_SIZE) {
      this.fileList = [];
      this.toster.error('Maximum File Size Limit is  20 MB ');
      return;
    }
    this.prepareFilesList($event);
  }

  prepareFilesList(files: Array<any>) {
    if (files != undefined) {
      for (const item of files) {
        item.progress = 0;
        this.fileList.push(item);
      }
    }
    this.uploadFilesSimulator(0);
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.fileList.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.fileList[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.fileList[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  get AAMCategory() {
    return this.form.get('AAMDefault').value
  }

  get LandingPageDefault() {
    return this.form.get('LandingPageDefault').value
  }

  get EmailTemplate() {
    return this.form.get('WelcomeEmailTemplate').value
  }

  back() {
    this.location.back();
  }

  submit() {
    const data = new FormData();
    if (this.ListOfVideo) {
      data.append('OfficeLogo', this.ListOfVideo)
    }
    data.append('Name', this.form.value.Name);
    data.append('AAMDefault', this.form.value.AAMDefault);
    data.append('CompanyInformation', this.form.value.CompanyInformation);
    data.append('LandingPageDefault', this.form.value.LandingPageDefault);
    data.append('WelcomeEmailTemplate', this.form.value.WelcomeEmailTemplate)
    data.append('ApplyPathDomain', this.form.value.ApplyPathDomain)
    data.append('Address', this.form.value.Address)
    data.append('OfficePhone', this.form.value.OfficePhone);
    data.append('MobilePhone', this.form.value.MobilePhone);
    data.append('SingleQuestionHeader', this.form.value.SingleQuestionHeader)
    data.append('OfficeDescription', this.form.value.OfficeDescription);
    data.append('landingPageTextColor', this.form.value.landingPageTextColor);
    data.append('subHeaderH2', this.form.value.subHeaderH2);
    data.append('teamspollicyAgrements', this.form.value.teamspollicyAgrements);
    data.append('bannerBackgroundColor', this.form.value.bannerBackgroundColor);
    data.append('startHereTextColor', this.form.value.startHereTextColor);
    data.append('aboutUsTextColor', this.form.value.aboutUsTextColor);
    data.append('footer', this.form.value.footer);
    data.append('ctaButtonsTextolor', this.form.value.ctaButtonsTextolor);

    const bulletPoints = []
    for (let i = 1; i <= BULLET_FIELDS; i++) {
      bulletPoints.push(this.form.value[`bulletPoint-${i}`])
    }
    data.append('bulletPoints', JSON.stringify(bulletPoints))

    if (!this.isEditForm) {
      this.user.addOffice(data).subscribe(res => {
        this.toster.success('Office added successfully');
        this.form.reset();
      }), () => {
        this.toster.error("Failed to add office, please try again");
      }
    } else {
      this.user.UpdateOfficceData(this.officeId, data).subscribe(res => {
        this.toster.success('Office updated successfully');
      }, () => {
        this.toster.error("Failed to update office, please try again")
      })
    }
  }

  createRange(number: number = BULLET_FIELDS): number[] {
    return new Array(number).fill(0)
      .map((n, index) => index + 1);
  }
}