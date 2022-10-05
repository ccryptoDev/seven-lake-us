import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/_services';

@Component({
  selector: 'app-edit-agent-form',
  templateUrl: './edit-agent-form.component.html',
  styleUrls: ['./edit-agent-form.component.scss']
})
export class EditAgentFormComponent implements OnInit {
  @Input() getSingleAgent?;
  public ProfileForm: FormGroup;
  data: any;
  passType: string;
  selectedLevel = "Standard"
  levels = [
    { id: 1, name: "Standard" },
    { id: 2, name: "Recruiter" },
    { id: 3, name: "Executive" },
    { id: 4, name: "Office" },
    { id: 5, name: "AAM Internal" },
    { id: 6, name: "ADMIN" }
  ]
  agentOffice: string;
  SelectedPageDefaultEmail = [];
  Status = [
    { value: "Active" },
    { value: "InActive" },
  ]
  StatusChart = 'Active';

  constructor(
    private formBuilder: FormBuilder,
    private editAgentService: UserService,
    private router: Router,
    private toster: ToastrService,
    private user: UserService
  ) { }

  ngOnInit(): void {
    this.gettingOfficeName();
    this.agentOffice = this.getSingleAgent.Office || ''
    this.passType = this.user.userDetails.Account_Type;
    this.data = this.getSingleAgent;
    this.ProfileForm = this.formBuilder.group({
      Zoho_Password: [''],
      Mobile_Phone: [''],
      Company: [''],
      AAM_Notes: [''],
      Agent_First: [''],
      Office: [''],
      Agent_Last: [''],
      Status: [''],
      Email: [''],
      Checks_Payable_To: [''],
      Source_URL: [''],
      Street: [''],
      City: [''],
      State: [''],
      Zip_Code: [''],
      Secondary_Email: [''],
      Hot_or_Not: [''],
      admin: [''],
      RBA_Commission: [''],
      Rating: [''],
      Account_Type: [{ value: this.editAgentService.agentDetails.Account_Type }],
      FA_Phone: [''],
      Website: [''],
      Commission_Notes: [''],
    });
    this.selectedLevel = this.editAgentService.agentDetails.Account_Type;
  }

  get getControl() {
    return this.ProfileForm.controls;
  }

  public onSubmit(): void {
    this.ProfileForm.value['Name'] = `${this.ProfileForm.value['Agent_First']} ${this.ProfileForm.value['Agent_Last']}`;
    const getAgentId = this.data.id;
    const data = this.ProfileForm.value;
    this.editAgentService.updateAgentData(getAgentId, data).subscribe(() => {
      this.toster.success('update data successfully');
      this.router.navigate(['MasterAdmin/agentmanager']);
    })
  }

  gettingOfficeName() {
    this.editAgentService.getOfficeNameFromApi().subscribe(res => {
      this.SelectedPageDefaultEmail = res.officeData;
    })
  }
}
