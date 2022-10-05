import { Component, Input, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { PaymentRole } from "src/app/types/payment-role.enum";

@Component({
	selector: 'manual-modal',
	styleUrls: ['./manual-modal.component.scss', '../modal.component.scss'],
	templateUrl: './manual-modal.component.html'
})
export default class ManualModalComponent {
	@Input() planType: PaymentRole;

	@ViewChild('confirmationPopupManual') manualModal: TemplateRef<any>;
	private modalRef: MatDialogRef<TemplateRef<any>>;

	constructor(public dialog: MatDialog) { }

	open() {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.restoreFocus = false;
		dialogConfig.autoFocus = false;
		dialogConfig.role = 'dialog';
		this.modalRef = this.dialog.open(this.manualModal, dialogConfig);
	}

	close() {
		this.modalRef.close();
	}
}