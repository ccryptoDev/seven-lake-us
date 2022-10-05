import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_guards';
import { InviteAgentsComponent } from './invite-agents.component';



const routes: Routes = [
  {
    path: 'invite-agent',
    component: InviteAgentsComponent,canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InviteAgentsRoutingModule { }

