import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from "@angular/forms";
import { UserService } from "../_services";
import { ToastrService } from "ngx-toastr";
import { cardMaskFactory } from "../phone-number.mask";
import { ActivatedRoute } from "@angular/router";
import { v4 as uuidv4 } from 'uuid';
import { MAX_DOCUMENT_SIZE } from "../constants/maxDocumentSize";

type LoadingFile = File & {
  key: string,
  progress: number
}

@Component({
  selector: "app-input-leads",
  templateUrl: "./input-leads.component.html",
  styleUrls: ["./input-leads.component.scss"],
})
export class InputLeadsComponent implements OnInit {
  @ViewChild("userForm") userForm: NgForm;
  numberMask = cardMaskFactory();
  leadDataDetailsId = "";
  fileList: LoadingFile[] = [];
  fileProgressList: LoadingFile[] = [];

  files: any[] = [];
  token = "";
  loginForm = new FormGroup({
    firstName: new FormControl("", Validators.required),
    lastName: new FormControl("", Validators.required),
    email: new FormControl("", Validators.required),
    mobileNo: new FormControl("", Validators.required),
    companyName: new FormControl(""),
    fundingGoal: new FormControl(""),
    description: new FormControl("", Validators.maxLength(100)),
  });

  @ViewChild("fileUploader") fileUploader: ElementRef<HTMLInputElement>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private user: UserService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe((res) => {
      if (!this.user.userDetails || !this.user.token) {
        this.user.getZohoToken().subscribe((response) => {
          this.user.token = response.tokenResponse.access_token;
          this.token = response.tokenResponse.access_token;
          this.user.getAgentsByEmail().subscribe((result) => {
            if (result && result.agent && result.agent.length) {
              this.user.userDetails = result.agent[0];
              const userData = this.user.userDetails;
              localStorage.setItem("UserDetails", JSON.stringify(userData));
            }
          });
        });
      } else {
        this.token = this.user.token;
      }
    });
  }

  get controls() {
    return this.loginForm.controls;
  }

  onAddUser(userData: any) {
    if (this.loginForm.invalid) {
      this.user.showError("Please fill mandatory fields");
      return;
    }

    const phoneNumber = userData.mobileNo;

    if (
      !/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/.test(
        phoneNumber
      )
    ) {
      this.user.showError("Phone number is not valid");
      return;
    }

    const values = {
      First_Name: userData.firstName,
      Last_Name: userData.lastName,
      Email: userData.email,
      Phone: userData.mobileNo,
      Company: userData.companyName,
      Amount_Requested: userData.fundingGoal,
      Description: userData.description,
      Member: this.user.userDetails.Member_Number,
      URL: this.user.userDetails.Website,
    };

    const formData = new FormData()
    for (let key in values) {
      formData.append(key, values[key])
    }
    this.fileList.forEach((item, index) => {
      formData.append(`files[${index}]`, item, item.name)
    })

    this.user.addLead(formData).subscribe((res) => {
      const Agent_First = this.user.userDetails.Agent_First;
      const Agent_Last = this.user.userDetails.Agent_Last;
      const LeadOwner = this.user.userDetails.Owner.name;
      let params = {
        leads: values,
        email: this.user.userDetails.Email,
        Agent_First: Agent_First,
        Agent_Last: Agent_Last,
        LeadOwner: LeadOwner,
      };
      this.user.leadMail(params).subscribe(() => {
        this.fileList = [];
        this.loginForm.reset();
        this.toastr.success("Leads inserted successfully", null, { disableTimeOut: false });
      });
    }), () => {
      this.toastr.success("Failed to insert leads, please try again");
    };
  }

  onFilesAdded(files: File[]) {
    for (let file of files) {
      if (file.size >= MAX_DOCUMENT_SIZE) {
        this.toastr.error("Maximum File Size Limit is  20 MB ");
        return
      }
    }
    this.prepareFilesList(files);
    this.fileUploader.nativeElement.value = '';
    this.fileUploader.nativeElement.files = null;
  }


  prepareFilesList(files: Array<File | LoadingFile>) {
    if (files) {
      for (const item of files as LoadingFile[]) {
        item.progress = 0;
        item.key = uuidv4();
        this.fileProgressList.push(item)
        this.uploadFilesSimulator(item);
      }
    }
  }

  removeFile(key: string) {
    this.fileList = this.fileList.filter(el => el.key !== key)
  }

  uploadFilesSimulator(item: LoadingFile) {
    setTimeout(() => {
      const progressInterval = setInterval(() => {
        const fileIndex = this.fileProgressList.findIndex(el => el.key === item.key)
        if (this.fileProgressList[fileIndex].progress >= 100) {
          clearInterval(progressInterval);
          this.toastr.success("File loaded", null, { disableTimeOut: false });
          this.fileList.push(this.fileProgressList[fileIndex]);
          this.fileProgressList = this.fileProgressList.filter(el => el.key !== item.key)
        } else {
          this.fileProgressList[fileIndex].progress += 5;
        }
      }, 200);
    }, 1000);
  }

  calculateSizeProgress(progress, totalSize) {
    const totalSizeInKb = totalSize / 1000;
    const progressSize = (totalSizeInKb / 100) * progress;
    return progressSize.toFixed(2);
  }

  get email() {
    return this.loginForm.get("email");
  }

  get description() {
    return this.loginForm.get("description");
  }

  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  disableField(checked) {
    Object.keys(this.controls).forEach((key) => {
      if (!checked) {
        this.controls[key].disable();
      } else {
        this.controls[key].enable();
      }
    });
  }
}
