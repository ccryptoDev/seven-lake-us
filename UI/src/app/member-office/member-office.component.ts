import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Document } from 'src/app/types/document.type';
import { UserService } from 'src/app/_services';
import { PaymentService } from 'src/app/_services/payment.service';
import { environment } from 'src/environments/environment';
import CardModalComponent from '../paments/card-modal/card-modal.component';
import ConfirmPaymentModalComponent from '../paments/confirm-payment/confirm-payment.component';
import { UserDetails } from '../types/user-details.type';

@Component({
	selector: 'member-office',
	templateUrl: './member-office.component.html',
	styleUrls: ['./member-office.component.scss']
})
export class GenericMemberOfficeComponent implements OnInit {

	@Input() category: string = "Member Office";
	@Input() paywall: boolean = true;
	selected: Document;
	data: Document[];

	@ViewChild(CardModalComponent) cardModal: CardModalComponent
	@ViewChild(ConfirmPaymentModalComponent) confirmModal: ConfirmPaymentModalComponent

	constructor(
		private user: UserService,
		private toastr: ToastrService,
		public paymentService: PaymentService,
		public dialog: MatDialog,
		private sanitizer: DomSanitizer,
		private tostr: ToastrService
	) { }

	ngOnInit(): void {
		this.user.listDocuments(this.category).subscribe(response => {
			this.data = response;
			this.data.forEach((element: Document) => {
				element.thumbnail = "../../../assets/images/short_form.png";
				this.user.getFiles(element.Thumbnail_Link).subscribe((blob) => {
					const objectUrl = URL.createObjectURL(new Blob([blob]))
					element.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
				});
				this.user.getFiles(element.Document_Link).subscribe((blob) => {
					const objectUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' })) + '#toolbar=0&navpanes=0';
					element.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
				});
			});
		})
	}

	pdfdownload(fileName: string, id: string) {
		this.user.getFiles(fileName).subscribe((blob) => {
			if (blob.msg === 'Fail') {
				this.user.showError("File not found");
				return;
			}
			const link = document.createElement('a')
			const objectURL = URL.createObjectURL(new Blob([blob]))
			link.href = objectURL
			link.download = fileName;
			link.click();
			link.remove()
			URL.revokeObjectURL(objectURL);
			this.user.getSingleDocument(id).subscribe(res => {
				const paramas = {
					download: res.documents.download
				}
				this.user.updateDownloaddocument(id, paramas).subscribe(() => {
					this.tostr.success('Your download update Successfully ')
				});
			})
		})
	}

	openConfirmationDialog = (id: string): void => {
		this.selected = this.data.find(item => item.id === id)
		if (this.paywall) {
			this.confirmModal.open()
		} else {
			this.pdfdownload(this.selected.Document_Link, this.selected.id);
		}
	}

	editDocument = (id: string) => {
		this.user.docmentadmin = id;
	}

	closeConfirmationpoup = () => {
		this.confirmModal.close()
	}

	confirmPayment = () => {
		this.openCardModal();
	}

	onSubmit = () => {
		const customer = this.user.userDetails as UserDetails
		const { CVV, cardNumber, expiryDate, holderName } = this.cardModal.creditCard
		var authorizeData = {
			"createTransactionRequest": {
				"merchantAuthentication": {
					"name": environment.transactionLogin,
					"transactionKey": environment.transactionKey
				},
				"transactionRequest": {
					"transactionType": "authOnlyTransaction",
					"amount": "1",
					"payment": {
						"creditCard": {
							"cardNumber": cardNumber,
							"expirationDate": expiryDate,
							"cardCode": CVV
						}
					},
					"poNumber": this.selected.id,
					"customer": {
						"id": customer.id
					},
					"processingOptions": {
						"isSubsequentAuth": "true"
					},
					"authorizationIndicatorType": {
						"authorizationIndicator": "final"
					}
				}
			}
		}

		this.paymentService.authorizeCC(authorizeData).subscribe(response => {
			if (response?.messages?.resultCode === 'Ok') {
				this.closeCardModal();
				this.toastr.success('Amount has been debited');
				this.pdfdownload(this.selected.Document_Link, this.selected.id);
			}
		}, () => {
			this.closeCardModal();
			this.toastr.warning('Transaction was unsucessful');
		});
	}

	openCardModal() {
		this.cardModal.open()
	}

	closeCardModal() {
		this.cardModal.close();
	}
}

