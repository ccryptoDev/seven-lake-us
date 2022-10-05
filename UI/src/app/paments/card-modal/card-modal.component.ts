import { Component, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { CreditCard } from "src/app/types/credit-card.type";

@Component({
	selector: 'card-modal',
	styleUrls: ['./card-modal.component.scss', '../modal.component.scss'],
	templateUrl: './card-modal.component.html'
})
export default class CardModalComponent implements OnInit {
	@Input() onSubmit: Function;
	@ViewChild('cardDetails') addCardDetails: TemplateRef<any>;
	private cardDetailsRef: MatDialogRef<TemplateRef<any>>;

	form: FormGroup

	constructor(public dialog: MatDialog) { }

	setForm() {
		this.form = new FormGroup({
			CVV: new FormControl(''),
			holderName: new FormControl(''),
			cardNumber: new FormControl(''),
			expiryDate: new FormControl('')
		})
	}

	ngOnInit() {
		this.setForm()
	}

	get creditCard(): CreditCard {
		return {
			CVV: this.form.controls.CVV.value,
			holderName: this.form.controls.holderName.value,
			cardNumber: this.form.controls.cardNumber.value,
			expiryDate: this.form.controls.expiryDate.value,
		}
	}

	open() {
		this.setForm()
		const dialogConfig = new MatDialogConfig();
		dialogConfig.restoreFocus = false;
		dialogConfig.autoFocus = false;
		dialogConfig.role = 'dialog';
		this.cardDetailsRef = this.dialog.open(this.addCardDetails, dialogConfig);
	}

	close() {
		this.cardDetailsRef.close();
	}

	submit() {
		this.onSubmit()
	}
}