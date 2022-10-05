import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { PaymentModule } from "../paments/payments.module";
import { GenericMemberOfficeComponent } from "./member-office.component";

@NgModule({
	declarations: [GenericMemberOfficeComponent],
	imports: [CommonModule, ReactiveFormsModule, RouterModule, PaymentModule],
	exports: [GenericMemberOfficeComponent]
})
export class MemberOfficeModule { }