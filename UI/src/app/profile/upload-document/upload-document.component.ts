import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/_services';
import { ViewChild } from '@angular/core';
import { MAX_DOCUMENT_SIZE } from 'src/app/constants/maxDocumentSize';
@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss']
})
export class UploadDocumentComponent implements OnInit {
  fileList: any[] = [];
  listOfFiles: any[] = [];
  progress = 0;
  uploadDocument:FormGroup;
  token = '';
  
  leadDataDetailsId = '';
  loading = true;
  @ViewChild('fileUploader')myInputVariable: ElementRef;
  constructor(private toastr:ToastrService,private fb:FormBuilder,private user:UserService,private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe((res) => {
      if (!this.user.userDetails) {
        this.user.getZohoToken().subscribe((response) => {
          this.user.token = response.tokenResponse.access_token;
          this.token = response.tokenResponse.access_token;
          this.user.getAgentsByEmail().subscribe((result) => {
            if (result && result.agent && result.agent.length) {
              this.user.userDetails = result.agent[0];
              const userData = this.user.userDetails;
              localStorage.setItem('UserDetails', JSON.stringify(userData));
              this.loading = false;
            }
          })
        })
      } else {
        this.loading = false;
        this.token = this.user.token;
      }
    })
    this.uploadDocument =  this.fb.group({
      file:[],
    })
  }
  
  uploadDocuments(data){
    console.log(data)
    console.log(this.token);
   
      for (var i = 0; i < this.fileList.length; i++) {
        const formData = new FormData();
        formData.append('file', this.fileList[i]);
        if (this.user.userDetails.id != '' && this.fileList != undefined) {
          this.user.uploadData(this.user.userDetails.id, formData).subscribe(data => {
            this.fileList = [];
            this.listOfFiles=[];
            this.reset()
            this.uploadDocument.reset();
            this.toastr.success('Document added successfully');
          });
        }
      }
  }
  reset() {
    console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = "";
    console.log(this.myInputVariable.nativeElement.files);
}
  resetFileUploader(index) {
    this.fileList.splice(index, 1);
  }
  onFileDropped($event) {
    console.log($event.file)
    
    if ($event['0'].size >= MAX_DOCUMENT_SIZE){
      this.fileList=[];
      this.toastr.error('Maximum File Size Limit is  20 MB ');
      return;
    }
    this.prepareFilesList($event);

  }
  onFileChanged(files) {
    
    if (files['0'].size >= MAX_DOCUMENT_SIZE){
      this.fileList=[];
      this.listOfFiles=[];
      this.toastr.error('Maximum File Size Limit is  20 MB ');
      return;
    }

    this.prepareFilesList(files);
  }
  prepareFilesList(files: Array<any>) {

    if (files != undefined) {
      for (const item of files) {
        item.progress = 0;
        this.fileList.push(item);
        // }
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
}
