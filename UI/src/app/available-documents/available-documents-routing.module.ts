import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AvailableDocumentComponent } from './available-document/available-document.component';
const routes: Routes = [
  {path:'availabledocuments',component:AvailableDocumentComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AvailableDocumentsRoutingModule { }
