import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/_services';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.scss']
})
export class AddVideoComponent implements OnInit {
  form: FormGroup;
  isSubmitted = false;
  url: string | SafeUrl;
  format: string;
  video: File;
  thumbnail: File
  categories = ['Sales', 'Funding Programs', 'CRM', 'Member Office']
  tags: string[] = []

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

  constructor(
    private formBuilder: FormBuilder,
    private toster: ToastrService,
    private user: UserService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      category: ['', [Validators.required]],
      price: ['', [Validators.required]],
      order: ['', [Validators.required]],
      tag: ['', []],
      description: ['', [Validators.required]],
      video: [''],
      thumbnail: ['', [Validators.required]]
    });
  }
  get getControl() {
    return this.form.controls;
  }

  removeTag(itemIndex: number) {
    this.tags = this.tags.filter((item, index) => index !== itemIndex)
  }

  addTag() {
    const value: string = this.tagInput.nativeElement.value
    if (this.tags.includes(value)) {
      this.toster.error('Tag is already present')
    } else if (value) {
      this.tags.push(value)
      this.form.patchValue({ tag: '' })
    }
  }

  onChange(event: InputEvent) {
    const value = (event.target as HTMLInputElement).value
    this.form.patchValue({ tag: value.replace(',', '') })
  }

  changeCategory(e) {
    this.Category.setValue(e.target.value, {
      onlySelf: true
    })
  }

  get Category() {
    return this.form.get('category')
  }

  onFileDropped(files: FileList) {
    this.updateFiles(Array.from(files))
  }

  onFileChanged(event: Event) {
    const input = event.target as HTMLInputElement
    this.updateFiles(Array.from(input.files) || [])
  }

  updateFiles(files: File[]) {
    const file = files?.[0]
    if (file) {
      this.video = file;
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.toster.error("Please fill mandatory fields");
      return;
    } else if (!this.tags.length) {
      this.toster.error("Please add tag");
      return
    } else if (!this.video || !this.thumbnail) {
      this.toster.error("Please add video and thumbnail");
      return
    }

    const formData = new FormData();
    formData.append('video', this.video)
    formData.append('thumbnail', this.thumbnail);
    formData.append('title', this.form.value.title);
    formData.append('category', this.form.value.category);
    formData.append('price', this.form.value.price)
    formData.append('order', this.form.value.order)
    formData.append('tags', this.tags.join(','))
    formData.append('description', this.form.value.description);

    this.user.uploadVideos(formData).subscribe(res => {
      this.toster.success('Documents added successfully')
      this.reset();
    }), error => {
      this.toster.error(error.error.msg);
    }
  }

  onThumbnailChange(event: any) {
    const file = event.target.files && event.target.files[0];
    this.thumbnail = file;

    if (file) {
      if (file.type.indexOf('image') > -1) {
        this.format = 'image';
      } else if (file.type.indexOf('video') > -1) {
        this.format = 'video';
      }
      const url = URL.createObjectURL(file)
      this.url = this.sanitizer.bypassSecurityTrustUrl(url)
    }
  }
  reset() {
    this.form.reset();
    this.form.patchValue({ category: '' })
    this.video = null
    this.thumbnail = null
    this.url = ''
  }
}
