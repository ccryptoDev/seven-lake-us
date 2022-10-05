import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingRouter } from './traingin.routing';
import { TrainingComponent } from './training.component';
import { SalesComponent } from './sales/sales.component';
import { FundingProgramsComponent } from './funding-programs/funding-programs.component';
import { CRMComponent } from './crm/crm.component';
import { MemberOfficeComponent } from './member-office/member-office.component';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SectionTrainingComponent } from './section/section.component';
import { PipesModule } from '../_pipes/pipes.module';
import { PaymentModule } from '../paments/payments.module';



@NgModule({
  declarations: [
    SalesComponent,
    FundingProgramsComponent,
    CRMComponent,
    TrainingComponent,
    MemberOfficeComponent,
    SectionTrainingComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TrainingRouter,
    FormsModule,
    Ng2SearchPipeModule,
    PipesModule,
    PaymentModule,
  ],exports:[]
})
export class TrainingModule { }
