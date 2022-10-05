import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadInformationComponent } from './lead-information.component';
import { MatCardModule } from '@angular/material/card';
import { NgxPaginationModule } from 'ngx-pagination';
import { LeadRoutingModule } from './lead-routing.module';
import { MatTableModule } from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { AgentsManagementComponent } from '../agents-management/agents-management.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { EditLeadsComponent } from './edit-leads/edit-leads.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
@NgModule({
  declarations: [LeadInformationComponent, AgentsManagementComponent, EditLeadsComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatCheckboxModule,
    MatSortModule,
    NgxPaginationModule,
    NgxPaginationModule,LeadRoutingModule,MatTableModule,MatPaginatorModule,ReactiveFormsModule,TextMaskModule
  ],
  exports:[LeadInformationComponent,MatCheckboxModule,MatTableModule,MatPaginatorModule, AgentsManagementComponent,MatSortModule]
})
export class LeadModule { }
