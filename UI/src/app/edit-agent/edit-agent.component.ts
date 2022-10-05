import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services';

@Component({
  selector: 'app-edit-agent',
  templateUrl: './edit-agent.component.html',
  styleUrls: ['./edit-agent.component.scss']
})
export class EditAgentComponent implements OnInit {
  AgentDetails: any  = '';
  constructor(private AgentdetailsService:UserService) { }

  ngOnInit(): void {
    this.AgentDetails = this.AgentdetailsService.agentDetails;
  }
}
