import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddVideoComponent } from './add-video/add-video.component';
import { LandingPageAdminComponent } from './landing-page-admin/landing-page-admin.component';
import { LandingPageTrackingComponent } from './landing-page-tracking/landing-page-tracking.component';
import { MasterAdminComponent } from './Master/master-admin.component';
import { OfficeManagerComponent } from './office-manager/office-manager.component';
import { AddOfficeComponent } from './add-office/add-office.component';
import { AgentManagerComponent } from './agent-manager/agent-manager.component';
import { URLManagerComponent } from './urlmanager/urlmanager.component';
import { AddFormAgentComponent } from './add-form-agent/add-form-agent.component';
import { FormManagerComponent } from './form-manager/form-manager.component';
import { UrlManagerFormComponent } from './url-manager-form/url-manager-form.component';
import { AddDocumentComponent } from './add-document/add-document.component';
import { ListOfDocumentComponent } from './list-of-document/list-of-document.component';
const routes: Routes = [
  {path:'MasterAdmin',component:MasterAdminComponent},
  {path:'leadpageAdmin',component:LandingPageAdminComponent},
  {path:'landingPageTracking',component:LandingPageTrackingComponent},
  {path:'addVideos',component:AddVideoComponent},
  {path:'officeManager',component:OfficeManagerComponent},
  {path:'addOffice',component:AddOfficeComponent},
  {path:'agentmanager',component:AgentManagerComponent},
  {path:'urlmanager',component:URLManagerComponent},
  {path:'formmanager',component:FormManagerComponent},
  {path:'addformmanager',component:AddFormAgentComponent},
  {path:'urlFormManager',component:UrlManagerFormComponent},
  {path:'ListOfDocument', component:ListOfDocumentComponent},
  {path: 'adddocument', component: AddDocumentComponent},  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterAdminRoutingModule { }
