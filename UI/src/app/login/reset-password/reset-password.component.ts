import { HttpErrorResponse } from "@angular/common/http";
import { Component, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { UserService } from "src/app/_services";

@Component({
	selector: 'reset-password',
	styleUrls: ['./reset-password.component.scss',],
	templateUrl: './reset-password.component.html'
})
export default class ResetPasswordComponent {
	userEmail: string;

	@ViewChild('resetPasswordModal') modal: TemplateRef<any>;
	private modalRef: MatDialogRef<TemplateRef<any>>;

	constructor(
		private toaster: ToastrService,
		private dialog: MatDialog,
		private userService: UserService
	) { }

	submit() {
		if (!this.userEmail) {
			this.toaster.error('Email is required')
			return
		}
		this.userService.sendPassword(this.userEmail).subscribe((response) => {
			this.toaster.success('Password reset, please check your email')
			this.close()
		}, (error: HttpErrorResponse) => {
			if (error.status === 404) {
				this.toaster.error('User not found, please enter another email')
			} else {
				this.toaster.error('Could not send an email, please try again')
			}
		})
		
	}

	close() {
		this.modalRef.close();
	}

	open() {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.restoreFocus = false;
		dialogConfig.autoFocus = false;
		dialogConfig.role = 'dialog';
		this.modalRef = this.dialog.open(this.modal, dialogConfig);
	}
}