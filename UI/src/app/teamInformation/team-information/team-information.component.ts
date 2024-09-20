import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { UserDetails } from "src/app/types/user-details.type";
import { UserService } from "src/app/_services";

// User with associated leads (?)
type ActiveUser = UserDetails & {
  currentMonthTeam: number,
  children: UserDetails[]
}

@Component({
  selector: "app-team-information",
  templateUrl: "./team-information.component.html",
  styleUrls: ["./team-information.component.scss"],
})
export class TeamInformationComponent implements OnInit {
  expanded: { [key: string]: boolean } = {};
  sortBy = 'Name';
  selectedId: string;
  message = '';
  note = '';
  userNotes: string[] = [];

  activeUsers: ActiveUser[] = [];
  inactiveUsers: UserDetails[] = [];

  @ViewChild('agentNotes') notesModal: TemplateRef<any>;
  private notesRef: MatDialogRef<TemplateRef<any>>;

  @ViewChild('agentMessage') messageModal: TemplateRef<any>;
  private messageRef: MatDialogRef<TemplateRef<any>>;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private toster: ToastrService
  ) { }

  isRowClickable(index: number): boolean {
    return this.activeUsers[index]?.children?.length > 0
  }

  onClick(rowIndex: number, rowId: number): void {
    if (this.isRowClickable(rowIndex)) {
      this.expanded[rowId] = !this.expanded[rowId];
    }
  }

  ngOnInit(): void {
    this.fetchDetails();
    this.loadInavctiveUsers();
  }

  fetchDetails(): void {
    this.userService.getInviteAgentsData().subscribe((data) => {
      this.activeUsers = data.team
      this.activeUsers.map(user => {
        // Count users created since 1 month ago
        const dateTreshold = new Date();
        dateTreshold.setMonth(dateTreshold.getMonth() - 1)

        const team: UserDetails[] = data.team.filter((member: UserDetails) => {
          const createdAt = new Date(member.Created_Time)
          return createdAt > dateTreshold
        });
        user.currentMonthTeam = team.length
        return user
      })
    });
  }

  loadInavctiveUsers() {
    this.userService.listInactiveUsers().subscribe((data) => {
      this.inactiveUsers = data;
    });
  }

  getAgentNotes(agentId = this.selectedId): string[] {
    const agent = this.activeUsers.find(agent => agent.id === agentId)
    return agent.notes
  }

  removeNote(index: number) {
    this.userNotes = this.userNotes.filter((note, i) => i !== index)
  }

  appendNote() {
    if (this.note) {
      this.userNotes.push(this.note)
      this.note = ''
    }
  }

  getConfig(): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.restoreFocus = false;
    dialogConfig.autoFocus = false;
    dialogConfig.role = 'dialog';
    return dialogConfig
  }

  openNotesModal(e: Event, agentId: string) {
    e.stopPropagation();
    this.selectedId = agentId;
    this.userNotes = this.getAgentNotes();
    this.notesRef = this.dialog.open(this.notesModal, this.getConfig());
  }

  closeNotesModal() {
    this.notesRef.close();
  }

  updateNote() {
    const body = {
      userId: this.userService.userDetails.id,
      targetId: this.selectedId,
      records: this.userNotes
    }

    this.userService.updateNote(body).subscribe(() => {
      const index = this.activeUsers.findIndex(agent => agent.id === this.selectedId)
      this.activeUsers[index].notes = this.userNotes
      this.note = ''
      this.userNotes = []
      this.closeNotesModal()
      this.toster.success('Note updated')
    }, () => {
      this.toster.error('Failed to update, please try again')
    })
  }

  sendMessage() {
    const body = {
      userId: this.userService.userDetails.id,
      targetId: this.selectedId,
      message: this.message
    }

    this.userService.messageAgent(body).subscribe(() => {
      this.closeNotesModal()
      this.toster.success('Message sent')
    }, () => {
      this.toster.error('Failed to send message, please try again')
    })
  }

  openMessageModal(e: Event, agentId: string) {
    e.stopPropagation();
    this.selectedId = agentId;
    this.message = '';
    this.messageRef = this.dialog.open(this.messageModal, this.getConfig());
  }

  closeMessageModal() {
    this.messageRef.close();
  }
}
