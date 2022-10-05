import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UserService } from 'src/app/_services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-manager',
  templateUrl: './form-manager.component.html',
  styleUrls: ['./form-manager.component.scss']
})
export class FormManagerComponent implements OnInit {

  title = 'My Angular Project!';
  todaydate: any;
  componentproperty: any;
  name: any;
  formdata: FormGroup;
  data;
  abc:any[]=[];
  toggle1:boolean=false;
  listData:any;
  agentGetData: any;

  constructor(private location:Location, private fb:FormBuilder, private user:UserService,private tostr:ToastrService) {
    this.listData=[];
    this.formdata = this.fb.group({
      name:[''],
      agentId:[''],
      subId:[''],
      optionChecked:[''],
      CompanyInformation:[''],
      newsChecked:[''],
      cOption:[''],
      optionsRadios:[''],
      email: [''],
      description:[''],
  });
   }

   public addItem():void{
    this.listData.push(this.formdata.value);
    console.log(this.listData);
   }


  ngOnInit() {
    this.getAgentForm();

       }

  getAgentForm(){
    this.user.getAgentFormData().subscribe(res=>{
      console.log(res.getOffice);
      this.agentGetData = res.getOffice;
    })
  }

  back(){
    this.location.back();
  }
  editdata(id){
    this.user.formManagerId = id;
  }
  DeleteSingleFormManagerData(id){
    this.user.DeleteSingleFormManagerData(id).subscribe(res=>{
      this.tostr.warning('Your Data has been deleted successFully');
      this.getAgentForm()
    })
  }
  displaySide(){
    this.toggle1 = !this.toggle1; 
    
  }

}
