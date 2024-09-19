import { Component, Input, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";

@Component({
	selector: 'confirm-payment',
	styleUrls: ['./confirm-payment.component.scss',],
	templateUrl: './confirm-payment.component.html'
})
export default class ConfirmPaymentModalComponent {

	@Input() message = 'Are you sure, You want to pay?'
	@Input() accept = 'Yes'	
	@Input() decline = 'No'	
	@Input() onConfirm: Function
	
	@ViewChild('confirmationPopupManual') confirmationPopupManual: TemplateRef<any>;
	private confirmationPopupManualRef: MatDialogRef<TemplateRef<any>>;

	constructor(public dialog: MatDialog) { }

	confirm() {
		this.close()
		this.onConfirm()
	}

	close() {
		this.confirmationPopupManualRef.close();
	}

	open() {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.restoreFocus = false;
		dialogConfig.autoFocus = false;
		dialogConfig.role = 'dialog';
		this.confirmationPopupManualRef = this.dialog.open(this.confirmationPopupManual, dialogConfig);
	}
}