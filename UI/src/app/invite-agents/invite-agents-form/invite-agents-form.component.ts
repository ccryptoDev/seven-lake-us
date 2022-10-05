import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserService } from "../../_services";
import { cardMaskFactory } from "../../phone-number.mask";
declare var gapi: any;
import { ToastrService } from "ngx-toastr";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-invite-agents-form",
  templateUrl: "./invite-agents-form.component.html",
  styleUrls: ["./invite-agents-form.component.scss"],
})
export class InviteAgentsFormComponent implements OnInit {
  InviteAgentsForm: FormGroup;
  auth2: gapi.auth2.GoogleAuth;
  numberMask = cardMaskFactory();
  gettingZohoEmail: any[] = [];

  constructor(
    public formBuilder: FormBuilder,
    private userService: UserService,
    private toster: ToastrService
  ) { }

  ngOnInit(): void {
    this.InviteAgentsForm = this.formBuilder.group({
      Name: ["", Validators.required],
      lastName: ["", [Validators.required]],
      MailId: ["", [Validators.required, Validators.email]],
      phoneNo: ["", [Validators.required, Validators.pattern(/^\(?\d{3}\)?[-\s\.]?\d{3}[-\s\.]?\d{4}/)]],
      office: [""],
    });
  }

  get isFormValid(): boolean {
    const control = this.getControl
    if (control.phoneNo.errors) return false
    if (control.MailId.errors) return false
    if (control.lastName.errors) return false
    if (control.Name.errors) return false
    return true
  }

  get getControl() {
    return this.InviteAgentsForm.controls;
  }

  onSubmit() {
    const email = this.InviteAgentsForm.value["MailId"];

    this.userService.getAgentsByEmail(email).subscribe((res) => {
      this.gettingZohoEmail = res.agent;
      if (res.agent?.length) {
        let EmailData = this.gettingZohoEmail.filter((x) => {
          return x.Email === email;
        });
        if (EmailData.length) {
          this.toster.error("Email already Exisit");
          return;
        }
      }

      const body = new FormData

      body.append('email', this.InviteAgentsForm.value.MailId)
      body.append('sponsor', this.userService.userDetails.Member_Number)
      body.append('agentName', this.userService.userDetails.Agent_First)
      body.append('office', this.userService.userDetails.office || '')
      body.append('firstName', this.InviteAgentsForm.value.Name)
      body.append('lastName', this.InviteAgentsForm.value.lastName)
      body.append('phoneNumber', this.InviteAgentsForm.value.phoneNo)

      this.userService.inviteAgent(body).subscribe(() => {
        this.InviteAgentsForm.reset();
        this.userService.showSuccess("Email has been sent successfully");
      }, (error: HttpErrorResponse) => {
        if (error.status === 409) {
          this.toster.error("Agent with such email is already invited");
        } else {
          this.toster.error("Failed to invite, please try again");
        }
      });
    });
  }

  EmailSync(): void {
    setTimeout(() => this.signIn(), 1000);
  }

  signIn() {
    gapi.load("auth2", () => {
      this.auth2 = gapi.auth2.init({
        client_id:
          "442318410124-g85inbsjktc0b2m241dhp5p88ng7esib.apps.googleusercontent.com",
        cookie_policy: "single_host_origin",
        scope:
          "profile email https://www.googleapis.com/auth/contacts.readonly",
      });
      this.auth2.attachClickHandler(
        document.getElementById("sync"),
        {},
        this.onSignIn(),
        this.onFailure
      );
    });
  }

  onSignIn(): any {
    setTimeout(() => this.fetchmail(), 1000);
  }

  fetchmail(): any {
    var maillist = [];
    gapi.load("client:auth2", () => {
      gapi.client
        .init({
          apiKey: "AIzaSyD7niZjG9_0mO3CBkZUyusNJ5FmAgAlVTU",
          discoveryDocs: [
            "https://people.googleapis.com/$discovery/rest?version=v1",
          ],
          clientId:
            "442318410124-g85inbsjktc0b2m241dhp5p88ng7esib.apps.googleusercontent.com",
          scope:
            "profile email https://www.googleapis.com/auth/contacts.readonly",
        })
        .then(() => {
          return gapi.client.people.people.connections.list({
            resourceName: "people/me",
            personFields: "emailAddresses,names",
          });
        })
        .then(
          (res) => {
            var rescount = res.result.connections.length;

            for (var i = 0; i < rescount; i++) {
              if ("emailAddresses" in res.result.connections[i]) {
                var list = {
                  Name: res.result.connections[i].names[0].displayName,
                  MailId: res.result.connections[i].emailAddresses[0].value,
                };
                maillist.push(list);
              }
            }
            if (maillist && maillist.length) {
              this.userService.inviteAgent(maillist).subscribe((res) => {
              });
            }
            this.userService.showSuccess(
              "Email has been sent successfully to all the contacts"
            );
          },
          (error) => console.log("ERROR " + JSON.stringify(error))
        );
    });
    return maillist;
  }
  onFailure() {
    throw new Error("Method not implemented.");
  }
}
