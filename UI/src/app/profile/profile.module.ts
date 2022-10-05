import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile.routing';
// import { ProfileHeaderComponent } from '../profile-header/profile-header.component';
import { UploadDocumentComponent } from './upload-document/upload-document.component';
import { MatCard, MatCardModule } from '@angular/material/card';
@NgModule({
  declarations: [ProfileFormComponent,ProfileComponent, UploadDocumentComponent],
  imports: [
    CommonModule,FormsModule,ReactiveFormsModule,ProfileRoutingModule,MatCardModule
  ],
  // exports:[ProfileComponent]
  exports:[MatCardModule]
})
export class ProfileModule { }
