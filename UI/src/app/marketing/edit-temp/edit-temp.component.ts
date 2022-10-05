import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../_services';

@Component({
  selector: 'app-edit-temp',
  templateUrl: './edit-temp.component.html',
  styleUrls: ['./edit-temp.component.scss']
})
export class EditTempComponent implements OnInit {
  AddDocuments: FormGroup;
  listOfFiles = [];
  selectedFiles;
  degreeTitleList = [];
  images;
  imageName;
  loading = false;
  data;
  pdfName: any;
  doc: any;
  constructor(public user: UserService,
    public formBuilder: FormBuilder,
    private toastr: ToastrService,
    private toster: ToastrService,
    private location: Location) { }

    category = [
      { value: 'Application', viewValue: 'Application' },
      { value: 'Manual', viewValue: 'Manual' },
      { value: 'Marketing', viewValue: 'Marketing' },
      { value: 'Social media', viewValue: 'Social media' },
      { value: 'Flyers', viewValue: 'Flyers' },
    ];
    ngOnInit(): void {
      this.AddDocuments = this.formBuilder.group({
        title: ['', Validators.required],
        category: ['', [Validators.required]],
        price: ['', [Validators.required]],
        order: ['', [Validators.required]],
        tag: ['', [Validators.required]],
        description: ['', [Validators.required]],
        file: [''],
        thumbnail: ['']
      });
      this.getSingleDocumentDetail();
    }
    get getControl() {
      return this.AddDocuments.controls;
    }
    back(){
      this.location.back();
      this.user.docmentadmin = '';
  
    }
    getSingleDocumentDetail() {
      this.data = this.user.docmentadmin;
      console.log(this.data);
      const data = this.data;
      this.user.getSingleDocument(data).subscribe(data => {
        this.data = data;
        console.log(data.documents);
        this.AddDocuments.get("title").setValue(data.documents.title);
        this.AddDocuments.get("category").setValue(data.documents.category);
        this.AddDocuments.get("price").setValue(data.documents.price);
        this.AddDocuments.get("order").setValue(data.documents.order);
        this.AddDocuments.get("tag").setValue(data.documents.tag);
        this.AddDocuments.get("description").setValue(data.documents.description);
        this.AddDocuments.get("file").setValue(data.documents.file);
        this.AddDocuments.get("thumbnail").setValue(data.documents.thumbnail);
      })
    }
    onSubmit() {
      if (this.AddDocuments.invalid) {
        this.toastr.error("Please fill mandatory fields");
        return;
      }
      const formData = new FormData();
      formData.append('file', this.selectedFiles);
      formData.append('title', this.AddDocuments.value.title);
      formData.append('description', this.AddDocuments.value.description)
      console.log(formData);
      const id = this.data.documents.id;
      this.user.UpdateDocument(id, formData).subscribe(res => {
        this.toster.success('Documents Update successfully');
        console.log(res)
        this.AddDocuments.reset();
        this.data = '';
        this.location.back();
      })
    }
  
  
    onFileChanged(event) {
      const file = event.target.files && event.target.files[0];
      this.selectedFiles = file;
      this.pdfName = this.selectedFiles.name;
    }
    onimageChanged(event: any) {
      this.images = event.target.files[0];
      this.imageName = this.images.name;
    }
    reset() {
      this.AddDocuments.reset();
    }
  }
  
