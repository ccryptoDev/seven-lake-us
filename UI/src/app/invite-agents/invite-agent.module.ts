import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InviteAgentsComponent } from './invite-agents.component';
import { InviteAgentsRoutingModule } from './invite-agents.routing';
import { InviteAgentsFormComponent } from './invite-agents-form/invite-agents-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';


@NgModule({
  declarations: [InviteAgentsComponent, InviteAgentsFormComponent],
  imports: [
    CommonModule,
    InviteAgentsRoutingModule,
    FormsModule,ReactiveFormsModule, TextMaskModule
  ]
})
export class InviteAgentModule { }
