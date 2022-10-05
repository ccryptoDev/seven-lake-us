import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketingComponent } from './marketing.component';
import { MarketingRouting } from './marketing.routing';
import { MarketingRoutingComponent } from './marketing-routing/marketing-routing.component';
import { SocialMediaComponent } from './social-media/social-media.component';
import { FlyersComponent } from './flyers/flyers.component';
import { EditTempComponent } from './edit-temp/edit-temp.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MarketingMemberComponent } from './member-office/member-office.component';
import { MemberOfficeModule } from '../member-office/member-office.module';
import { DocumentPreviewModule } from '../document-preview/document-preview.module';
import { PaymentModule } from '../paments/payments.module';


@NgModule({
  declarations: [MarketingComponent, MarketingRoutingComponent, SocialMediaComponent, FlyersComponent, EditTempComponent, MarketingMemberComponent],
  imports: [
    CommonModule,
    MarketingRouting,
    ReactiveFormsModule,
    MemberOfficeModule,
    DocumentPreviewModule,
    PaymentModule
  ]
})
export class MarketingModule { }
