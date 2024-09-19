import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/_services';



@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss']
})
export class ProfileFormComponent implements OnInit {
  @Input() getUserData?;
  public ProfileForm: FormGroup;
  selectedLevel = 'Standard';
  levels = [];
  selectedPassword = '';
  selectedCurPassword = '';
  constructor(private formBuilder: FormBuilder, private userService: UserService, private toastrService: ToastrService) { }

  ngOnInit(): void {
    if (this.getUserData.Account_Type !== null) {
      this.selectedLevel = this.getUserData.Account_Type;
    }
    this.levels = [
      { id: 1, name: "Standard" },
      { id: 2, name: "Recruiter" },
      { id: 3, name: "Executive" },
      { id: 4, name: "Office" },
      { id: 5, name: "AAM Internal" },
      { id: 6, name: "ADMIN" }
    ];
    this.ProfileForm = this.formBuilder.group({
      Email: [{ value: this.getUserData.Email, disabled: true }, Validators.required],
      Agent_First: [{ value: this.getUserData.Agent_First, disabled: true }, [Validators.required]],
      Agent_Last: [{ value: this.getUserData.Agent_Last, disabled: true }, [Validators.required]],
      Payable_To: [{ value: this.getUserData.Payable_To, disabled: true }, [Validators.required]],
      Additional_Address: [{ value: this.getUserData.Additional_Address, disabled: true }, [Validators.required]],
      State: [{ value: this.getUserData.State, disabled: true }, [Validators.required]],
      Website: [{ value: this.getUserData.Website, disabled: true }, [Validators.required]],
      Mobile_Phone: [{ value: this.getUserData.Mobile_Phone, disabled: true }, [Validators.required]],
      Company: [{ value: this.getUserData.Company, disabled: true }, [Validators.required]],
      Street: [{ value: this.getUserData.Street, disabled: true }, [Validators.required]],
      City: [{ value: this.getUserData.City, disabled: true }, [Validators.required]],
      StateZip_Code: [{ value: this.getUserData.StateZip_Code, disabled: true }, [Validators.required]],
      Account_Type: [{ disabled: true }],
      Zoho_Password: [],
      Password: this.formBuilder.group({
        password: [''],
        confirmPassword: ['']
      }),
      update: ['yes']
    });
  }

  get getControl() {
    return this.ProfileForm.controls;
  }

  public onSubmit(): void {

    const password: string = this.ProfileForm.value.Password.password
    const confirm: string = this.ProfileForm.value.Password.confirmPassword

    if ((password || confirm) && password !== confirm) {
      this.toastrService.error('Passwords dont match')
      return
    } else if (password.length < 6) {
      this.toastrService.error('Password is too short')
      return
    }


    if (password) {
      this.ProfileForm.value['password'] = password;
    }

    const firstName = this.ProfileForm.value['Agent_First'] ? this.ProfileForm.value['Agent_First'] : this.userService.userDetails['Agent_First'];
    const lastName = this.ProfileForm.value['Agent_Last'] ? this.ProfileForm.value['Agent_Last'] : this.userService.userDetails['Agent_Last'];
    this.ProfileForm.value['Name'] = `${firstName} ${lastName}`;

    this.userService.profileUpdate(this.ProfileForm.value,).subscribe((res) => {
      this.userService.userDetails.Zoho_Password = password;
      this.userService.userDetails.Account_Type = this.ProfileForm.value.Account_Type;
      localStorage.setItem('UserDetails', JSON.stringify(this.userService.userDetails));
      this.userService.showSuccess('Values has been added successfully');
      (this.ProfileForm.controls.Password as FormGroup).controls['password'].setValue('');
      (this.ProfileForm.controls.Password as FormGroup).controls['confirmPassword'].setValue('');
    })
  }

  email() {
    this.ProfileForm.controls['Email'].enable();
  }
  firstName() {
    this.ProfileForm.controls['Agent_First'].enable();
  }
  lastName() {
    this.ProfileForm.controls['Agent_Last'].enable();
  }
  payableTo() {
    this.ProfileForm.controls['Payable_To'].enable();
  }
  additionalAddress() {
    this.ProfileForm.controls['Additional_Address'].enable();
  }
  state() {
    this.ProfileForm.controls['State'].enable();
  }
  linkinProfileUrl() {
    this.ProfileForm.controls['Website'].enable();
  }
  phoneNo() {
    this.ProfileForm.controls['Mobile_Phone'].enable();
  }
  companyName() {
    this.ProfileForm.controls['Company'].enable();
  }
  streetAddress() {
    this.ProfileForm.controls['Street'].enable();
  }
  city() {
    this.ProfileForm.controls['City'].enable();
  }
  zipCode() {
    this.ProfileForm.controls['StateZip_Code'].enable();
  }
  admin() {
    this.ProfileForm.controls['admin'].enable();
  }
}


