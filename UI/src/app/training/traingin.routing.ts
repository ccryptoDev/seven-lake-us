import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CRMComponent } from './crm/crm.component';
import { FundingProgramsComponent } from './funding-programs/funding-programs.component';
import { MemberOfficeComponent } from './member-office/member-office.component';
import { SalesComponent } from './sales/sales.component';
import { TrainingComponent } from './training.component';
const routes: Routes = [
    {path:'sale',component:SalesComponent},
    {path:'fundingprogram',component:FundingProgramsComponent},
    {path:'crm',component:CRMComponent},
    {path:'MemberOffice',component:MemberOfficeComponent}
   
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingRouter { }
