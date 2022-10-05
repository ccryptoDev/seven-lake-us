import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterAdminRoutingModule } from './master-admin.routing';
import { MasterAdminComponent } from './Master/master-admin.component';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { LandingPageAdminComponent } from './landing-page-admin/landing-page-admin.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { LandingPageTrackingComponent } from './landing-page-tracking/landing-page-tracking.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddVideoComponent } from './add-video/add-video.component';
import { MatOptionModule } from '@angular/material/core';
import { OfficeManagerComponent } from './office-manager/office-manager.component';
import { AddOfficeComponent } from './add-office/add-office.component';
import { AgentManagerComponent } from './agent-manager/agent-manager.component';
import { URLManagerComponent } from './urlmanager/urlmanager.component';
import { AddFormAgentComponent } from './add-form-agent/add-form-agent.component';
import { FormManagerComponent } from './form-manager/form-manager.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { UrlManagerFormComponent } from './url-manager-form/url-manager-form.component'; import { AddDocumentComponent } from './add-document/add-document.component';
import { ListOfDocumentComponent } from './list-of-document/list-of-document.component';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FileDropDirective } from '../_directives/file-drop.directive';
import { URLSelectComponent } from './urlmanager/url-select/url-select.component';
import { URLSelectManagedComponent } from './urlmanager/url-select-managed/url-select-managed.component';
import { TextMaskModule } from 'angular2-text-mask';
import { PipesModule } from '../_pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { LandingPageForm } from './landing-page-admin/landing-page-form/landing-page-form.component';

@NgModule({
  declarations: [MasterAdminComponent, URLManagerComponent,
    LandingPageAdminComponent, AddDocumentComponent, FileDropDirective,
    URLSelectComponent, URLSelectManagedComponent, LandingPageForm,
    AdminHeaderComponent, LandingPageTrackingComponent, AddVideoComponent,
    OfficeManagerComponent, AddOfficeComponent, AgentManagerComponent,
    FormManagerComponent, AddFormAgentComponent, UrlManagerFormComponent,
    ListOfDocumentComponent
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    MatCardModule,
    MasterAdminRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSortModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    FormsModule,
    Ng2SearchPipeModule,
    TextMaskModule,
    PipesModule,
    RouterModule, 
  ],
  exports: [MatCardModule, AddOfficeComponent,
    NgxPaginationModule, MatTableModule, MatButtonModule,
    MatSelectModule, MatPaginatorModule, MatFormFieldModule,
    MatMenuModule, MatSortModule, FormsModule,
  ]
})
export class MasterAdminModule { }
