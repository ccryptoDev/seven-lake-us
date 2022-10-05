import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { cardMaskFactory } from "../../phone-number.mask";
import { UserService } from 'src/app/_services';

@Component({
  selector: 'app-edit-leads',
  templateUrl: './edit-leads.component.html',
  styleUrls: ['./edit-leads.component.scss']
})
export class EditLeadsComponent implements OnInit {
  title = 'My Angular Project!';
  todaydate: any;
  componentproperty: any;
  name: any;
  formdata: FormGroup;
  data;
  abc: any[] = [];
  toggle1: boolean = false;
  listData: any;
  numberMask = cardMaskFactory();
  SelectedPageDefaultEmail = [];
  fromServiceLeadsdata: any = {};
  selectedLevelLead = 'New Lead';
  files: any;
  filesData: any;
  GettingOwner;
  objt: { email: any; details: any; };
  constructor(private fb: FormBuilder, private user: UserService, private toster: ToastrService, private location: Location) {
    this.listData = [];

  }


  public addItem(): void {
    this.listData.push(this.formdata.value);
    console.log(this.listData);
  }

  ngOnInit(): void {
    this.fromServiceLeadsdata = this.user.leadsData;
    // console.log('this is form Service',this.fromServiceLeadsdata);
    this.data = this.user.leadsData.id;
    this.selectedLevelLead = this.user.leadsData.Lead_Status;
    this.SelectedPageDefaultEmail = [
      { id: 1, name: "Appointment Set" },
      { id: 2, name: "New Lead" },
      { id: 3, name: "test lead" },
      { id: 4, name: "Bad Lead" },
      { id: 5, name: "Interested" },
      { id: 6, name: "3rd Attempt" }
    ];

    this.formdata = this.fb.group({
      First_Name: [''],
      Last_Name: [''],
      Company: [''],
      Email: [''],
      Phone: [''],
      Lead_Status: [''],
      Credit_Lines_Obtained: [''],
      Retirement_Rating: [''],
      Revenue_Based_Rating: [''],
      Equipment_Rating: [''],
      SBA_Loan_Offer: [''],
      Underwriter_Notes: [''],
      Description: [''],
      comments: [''],
    });
    this.getSingleFormAgentData();

  }
  editLeadsbyEmail(){
    const meneber = this.fromServiceLeadsdata.Member;
    this.user.getAgentsByMemberCode(meneber).subscribe((data)=> {
      let leadFirstName= this.user.leadsData.First_Name;
      let Last_Name= this.user.leadsData.Last_Name;
      
      this.GettingOwner = data.agent;
      this.GettingOwner.forEach(element => {
        console.log(element.Owner.email);
        console.log(element.Owner['name']);
        const obj={
          email:element.Owner.Email,
          ownerName: element.Owner.name,
          Agent_First:element.Agent_First,
          Agent_Last:element.Agent_Last,
          Mobile_Phone:element.Mobile_Phone,
          AAM_Notes:element.AAM_Notes,
          leadFirstName:leadFirstName,
          Last_Name:Last_Name
        }
        this.user.editLeadssendEmail(obj).subscribe((data) => {
          console.log(data)
          this.user.showSuccess("Request email sent successfully")
        });
      });
    })
  }

  updateLeadCommentsOnMail(){
    const meneber = this.fromServiceLeadsdata.Member;
    this.user.getAgentsByMemberCode(meneber).subscribe((data)=> {
      this.GettingOwner = data.agent;
      this.GettingOwner.forEach(element => {
         this.objt={
          email:element.Owner.email,
          // email:'chauhan9069@gmail.com',
          details:this.formdata.value,
        }
        
      });
      this.user.leadNotes(this.objt).subscribe((data) => {
        console.log(data);
        this.user.showSuccess("Request email sent successfully");
      });
    })
  }

  getSingleFormAgentData() {
    this.formdata.get("First_Name").setValue(this.fromServiceLeadsdata.First_Name);
    this.formdata.get("Last_Name").setValue(this.fromServiceLeadsdata.Last_Name);

    this.formdata.get("Company").setValue(this.fromServiceLeadsdata.Company);
    this.formdata.get("Email").setValue(this.fromServiceLeadsdata.Email);
    this.formdata.get("Phone").setValue(this.fromServiceLeadsdata.Phone);
    this.formdata.get("Lead_Status").setValue(this.fromServiceLeadsdata.Lead_Status);
    this.formdata.get("Credit_Lines_Obtained").setValue(this.fromServiceLeadsdata.Credit_Lines_Obtained);
    this.formdata.get("Retirement_Rating").setValue(this.fromServiceLeadsdata.Retirement_Rating);
    this.formdata.get("Revenue_Based_Rating").setValue(this.fromServiceLeadsdata.Revenue_Based_Rating);
    this.formdata.get("Equipment_Rating").setValue(this.fromServiceLeadsdata.Equipment_Rating);
    this.formdata.get("SBA_Loan_Offer").setValue(this.fromServiceLeadsdata.SBA_Loan_Offer);
    this.formdata.get("Underwriter_Notes").setValue(this.fromServiceLeadsdata.Underwriter_Notes);
    this.formdata.get("Description").setValue(this.fromServiceLeadsdata.Description);
    this.formdata.get("comments").setValue(this.fromServiceLeadsdata.Contract_Notes);

  }
  importData() {
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = _ => {
      // you can use this method to get file and perform respective operations
      this.filesData = Array.from(input.files);
      this.files = this.filesData[0].name;
    };
    input.click();

  }
  onClickSubmit() {
    this.updateLeadCommentsOnMail();
    console.log(this.updateLeadCommentsOnMail());
    console.log(this.formdata.value);
    const formData = new FormData();
    formData.append('file', this.filesData[0])
    formData.append('Contract_Notes', this.formdata.value.comments)
    //  console.log(id);
    if (this.filesData.length) {
      this.user.uploadimage(this.fromServiceLeadsdata.id, formData).subscribe(data => {
        this.data = [];
        this.formdata.reset();
        this.toster.success('Upload Image  successfully');
      });
    };
    if (this.formdata.value.comments != null) {
      this.user.updateleadsData(this.fromServiceLeadsdata.id, formData).subscribe(res => {
        this.data = [];
        this.formdata.reset();
        this.toster.success('Comment Added successfully');
      })
    }

  }

  back() {
    this.location.back()
    // this.location.back();
    this.user.formManagerId = '';
  }

  displaySide() {
    this.toggle1 = !this.toggle1;

  }
}
