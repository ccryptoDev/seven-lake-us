import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import CardModalComponent from "./card-modal/card-modal.component";
import ConfirmPaymentModalComponent from "./confirm-payment/confirm-payment.component";
import ManualModalComponent from "./phone-modal/manual-modal.component";

@NgModule({
	declarations: [CardModalComponent, ManualModalComponent, ConfirmPaymentModalComponent],
	imports: [CommonModule, ReactiveFormsModule],
	exports: [CardModalComponent, ManualModalComponent, ConfirmPaymentModalComponent]
})
export class PaymentModule { }