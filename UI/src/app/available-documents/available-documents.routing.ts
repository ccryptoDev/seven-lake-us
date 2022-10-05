import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AvailableDocumentComponent } from './available-document/available-document.component';
import { ManualDocumentsComponent } from './manual-documents/manual-documents.component';
import { DocumentMemberOfficeComponent } from './document-member/document-member.component';
const routes: Routes = [
  { path: 'application', component: AvailableDocumentComponent },
  { path: 'manualDocument', component: ManualDocumentsComponent },
  { path: 'member', component: DocumentMemberOfficeComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AvailableDocumentsRoutingModule { }
