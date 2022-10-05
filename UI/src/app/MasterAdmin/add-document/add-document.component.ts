import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../_services';
import { MAX_DOCUMENT_SIZE } from 'src/app/constants/maxDocumentSize';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss']
})
export class AddDocumentComponent implements OnInit {
  AddDocuments: FormGroup;
  listOfFiles = [];
  selectedFiles;
  pdfName: any;
  degreeTitleList = [];
  images;
  imageName;
  loading = false;
  data;
  defaultcategory = 'Application';
  category: any[] = [];
  imageUrl: string | SafeUrl;

  constructor(public user: UserService,
    public formBuilder: FormBuilder,
    private toastr: ToastrService,
    private toster: ToastrService,
    private location: Location,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.category = [
      { value: 'Application', viewValue: 'Application' },
      { value: 'Manual', viewValue: 'Manual' },
      { value: 'Email Template', viewValue: 'Email Template' },
      { value: 'Social Media', viewValue: 'Social Media' },
      { value: 'Flyers', viewValue: 'Flyers' },
      { value: 'Member Office', viewValue: 'Member Office' },
      { value: 'Document', viewValue: 'Document' },
    ];
    this.AddDocuments = this.formBuilder.group({
      title: ['', Validators.required],
      category: ['', [Validators.required]],
      price: ['', [Validators.required]],
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

  back() {
    this.location.back();
    this.user.docmentadmin = '';

  }
  getSingleDocumentDetail() {
    this.data = this.user.docmentadmin;
    const data = this.data;
    this.user.getSingleDocument(data).subscribe(data => {
      console.log(data);
      this.AddDocuments.get("title").setValue(data.documents.title);
      this.AddDocuments.get("category").setValue(data.documents.category);
      this.AddDocuments.get("price").setValue(data.documents.price);
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
    formData.append('thumbnail', this.images);
    formData.append('title', this.AddDocuments.value.title);
    formData.append('category', this.AddDocuments.value.category);
    formData.append('price', this.AddDocuments.value.price)
    formData.append('tag', this.AddDocuments.value.tag)
    formData.append('description', this.AddDocuments.value.description)
    console.log(formData);


    if (this.data == '' || !this.data) {
      this.user.uploadDocument(formData).subscribe(res => {
        this.loading = false;
        this.toastr.success('Documents added successfully')
        this.reset();
        this.data = '';
        this.location.back();
      }), error => {
        this.toastr.error(error.error.msg);
      }
    }

    if (this.data != '') {
      const id = this.data;
      this.user.UpdateDocument(id, formData).subscribe(res => {
        this.toster.success('Documents Update successfully');
        console.log(res)
        this.AddDocuments.reset();
        this.data = '';
        this.location.back();
      })
    }
  }

  onFileDropped(files: FileList) {
    this.updateFiles(Array.from(files))
  }

  onFileChanged(event: Event) {
    const input = event.target as HTMLInputElement
    this.updateFiles(Array.from(input.files) || [])
  }

  updateFiles(files: File[]) {
    for (let file of files) {
      if (file.size >= MAX_DOCUMENT_SIZE) {
        this.listOfFiles = [];
        this.toastr.error('Maximum File Size Limit is  20 MB ');
        return;
      }
    }

    this.listOfFiles = [];
    for (var i = 0; i < files.length; i++) {
      this.selectedFiles = files[i];
      this.pdfName = this.selectedFiles.name;
    }
  }

  onimageChanged(event: any) {
    const file = event.target.files[0]
    if (file) {
      this.images = file;
      this.imageName = file.name;
      
      const imageUrl = URL.createObjectURL(file)
      this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(imageUrl)
    }
  }

  reset() {
    this.AddDocuments.reset();
    this.imageUrl = '';
  }
}
