import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import URL_OPTIONS from 'src/app/constants/urlOptions';
import { ManagedURLService } from 'src/app/_services/managed-url.service';

@Component({
  selector: 'app-url-manager-form',
  templateUrl: './url-manager-form.component.html',
  styleUrls: ['./url-manager-form.component.scss']
})
export class UrlManagerFormComponent implements OnInit {
  form: FormGroup;
  urls: string[] = [];
  urlOptions = URL_OPTIONS

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private urlService: ManagedURLService,
    private toster: ToastrService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      thirdParty: [],
      status: [],
      name: [],
    })
  }

  back() {
    this.location.back();
  }

  onSelect = (values: string[]) => {
    this.urls = values;
  }

  submit() {
    const data = {
      thirdParty: this.form.value.thirdParty,
      isActive: this.form.value.status === 'Active',
      name: this.form.value.name,
      urls: this.urls
    }
    
    if (!this.urls.length) {
      this.toster.error('Please select URL');
      return
    }
    if (!data.name) {
      this.toster.error('Please enter name');
      return
    }
    if (!data.thirdParty) {
      this.toster.error('Please enter third party');
      return
    }

    this.urlService.addUrl(data).subscribe(() => {
      this.toster.success('URL added successfully');
      this.location.back();
    })
  }
}
