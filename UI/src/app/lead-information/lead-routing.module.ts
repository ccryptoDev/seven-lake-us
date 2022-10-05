import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgentsManagementComponent } from '../agents-management/agents-management.component';
import { EditLeadsComponent } from './edit-leads/edit-leads.component';
import { LeadInformationComponent } from './lead-information.component';



const routes: Routes = [
  {
    path: 'InformationLead',
    component: LeadInformationComponent
  },
  { path: 'agent-information', component: AgentsManagementComponent },
  {path:'edit-leads',component:EditLeadsComponent}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadRoutingModule { }

