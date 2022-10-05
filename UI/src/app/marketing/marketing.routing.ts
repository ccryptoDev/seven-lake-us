import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlyersComponent } from './flyers/flyers.component';
import { MarketingComponent } from './marketing.component';
import { SocialMediaComponent } from './social-media/social-media.component';
import { EditTempComponent } from './edit-temp/edit-temp.component';
import { MarketingMemberComponent } from './member-office/member-office.component';

const routes: Routes = [
  { path: 'EmailTemplates', component: MarketingComponent },
  { path: 'SocialMedia', component: SocialMediaComponent },
  { path: 'Flyers', component: FlyersComponent },
  { path: 'edittemplates', component: EditTempComponent },
  { path: 'MemberOffice', component: MarketingMemberComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingRouting { }
