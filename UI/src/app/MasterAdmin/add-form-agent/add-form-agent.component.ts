import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { Location } from "@angular/common";
import { UserService } from "src/app/_services";
import { ToastrService } from "ngx-toastr";
import { cardMaskFactory } from "../../phone-number.mask";

@Component({
  selector: "app-add-form-agent",
  templateUrl: "./add-form-agent.component.html",
  styleUrls: ["./add-form-agent.component.scss"],
})
export class AddFormAgentComponent implements OnInit {
  todaydate: any;
  componentproperty: any;
  numberMask = cardMaskFactory();
  name: any;
  formdata: FormGroup;
  data;
  listData: any;

  constructor(
    private location: Location,
    private fb: FormBuilder,
    private user: UserService,
    private toster: ToastrService
  ) {
    this.listData = [];
    this.formdata = this.fb.group({
      name: [""],
      firstName: [""],
      lastName: [""],
      phone: [""],
      agentId: [""],
      subId: [""],
      formManagerDropdow: [""],
      receiveDrips: ["Yes"],
      receiveLetters: ["Yes"],
      optionsRadios: [""],
      email: [""],
      description: [""],
    });
  }

  public addItem(): void {
    this.listData.push(this.formdata.value);
  }

  ngOnInit() {
    this.getSingleFormAgentData();
  }
  getSingleFormAgentData() {
    this.data = this.user.formManagerId;
    const data = this.data;
    this.user.getSingleFormAgent(data).subscribe((data) => {
      this.formdata.get("name").setValue(data.formManager.name);
      this.formdata.get("firstName").setValue(data.formManager.firstName);
      this.formdata.get("lastName").setValue(data.formManager.lastName);
      this.formdata.get("phone").setValue(data.formManager.phone);
      this.formdata.get("agentId").setValue(data.formManager.agentId);
      this.formdata.get("subId").setValue(data.formManager.subId);
      this.formdata.get("email").setValue(data.formManager.email);
      this.formdata.get("description").setValue(data.formManager.description);
      this.formdata.get("formManagerDropdow").setValue(data.formManager.formManagerDropdow);
      this.formdata.get("receiveLetters").setValue(data.formManager.receiveLetters ? "Yes" : "No");
      this.formdata.get("receiveDrips").setValue(data.formManager.receiveDrips ? "Yes" : "No");
    });
  }
  onClickSubmit() {
    const formData = new FormData();
    formData.append("AgentID", this.formdata.value.agentId);
    formData.append("description", this.formdata.value.description);
    formData.append("email", this.formdata.value.email);
    formData.append("firstName", this.formdata.value.firstName);
    formData.append("lastName", this.formdata.value.lastName);
    formData.append("name", this.formdata.value.name);
    formData.append("formManagerDropdow", this.formdata.value.formManagerDropdow);
    formData.append("phone", this.formdata.value.phone);
    formData.append("SubId", this.formdata.value.subId);
    formData.append("receiveLetters", this.formdata.value.receiveLetters === "Yes" ? "true" : "false");
    formData.append("receiveDrips", this.formdata.value.receiveDrips === "Yes" ? "true" : "false");

    if (!this.data) {
      this.user.addForm(formData).subscribe((res) => {
        this.toster.success("Documents added successfully");
        this.formdata.reset();
      }),
        (error) => {
          this.toster.error(error.error.msg);
        };
    }
    if (this.data) {
      const id = this.data;
      this.user.UpdateFormAgentData(id, formData).subscribe((res) => {
        this.toster.success("Documents Update successfully");
        this.formdata.reset();
        this.data = "";
        this.location.back();
      });
    }
  }

  back() {
    this.location.back();
    this.user.formManagerId = "";
  }
}
