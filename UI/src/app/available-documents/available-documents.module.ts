import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailableDocumentsRoutingModule } from './available-documents.routing';
import { AvailableDocumentComponent } from './available-document/available-document.component';
import { ManualDocumentsComponent } from './manual-documents/manual-documents.component';
import { TextMaskModule } from 'angular2-text-mask';
import { FormErrorsComponent } from "../form-errors/form-errors.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DocumentMemberOfficeComponent } from './document-member/document-member.component';
import { MemberOfficeModule } from '../member-office/member-office.module';
import { PaymentModule } from '../paments/payments.module';
@NgModule({
  declarations: [AvailableDocumentComponent, DocumentMemberOfficeComponent, FormErrorsComponent, ManualDocumentsComponent],
  imports: [CommonModule, PaymentModule, AvailableDocumentsRoutingModule, TextMaskModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MemberOfficeModule],
})
export class AvailableDocumentsModule { }
