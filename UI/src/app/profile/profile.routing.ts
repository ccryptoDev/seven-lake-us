import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards';
import { ProfileComponent } from './profile.component';
import {UploadDocumentComponent} from './upload-document/upload-document.component';


const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,canActivate: [AuthGuard]
  },
  {
    path: 'uploaddocument',
    component: UploadDocumentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }

