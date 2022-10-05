import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserService } from 'src/app/_services';
import { PaymentService } from 'src/app/_services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { ICardType } from 'src/app/card-type.interface';
import { FormGroup, FormBuilder, Validators, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { cardMaskFactory, ccvMask, expiryMask } from '../../payment.mask';
import { requiredMethodTypes } from '../../required-method-types.value';
import { cardValidator } from 'src/app/card.validator';
import { expiryStringValidator } from 'src/app/expiry-string.validator';
import CardModalComponent from 'src/app/paments/card-modal/card-modal.component';
import ConfirmPaymentModalComponent from 'src/app/paments/confirm-payment/confirm-payment.component';
import { environment } from 'src/environments/environment';
import { UserDetails } from 'src/app/types/user-details.type';

@Component({
  selector: 'app-manual-documents',
  templateUrl: './manual-documents.component.html',
  styleUrls: ['./manual-documents.component.scss'], providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ManualDocumentsComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: ManualDocumentsComponent,
      multi: true,
    },
  ],
})
export class ManualDocumentsComponent implements OnInit {
  pdfName: string = "";
  data: any;
  downloadasstring;
  fileName = "sample.pdf";
  newfile: [] = []
  form: FormGroup;
  numberMask = cardMaskFactory();
  ccvMask = ccvMask;
  expiryMask = expiryMask;
  thumbnail: string;
  filter = 'Manual';
  docLink = '';
  docid = '';
  cardType: ICardType = null;
  requiredMethodTypes = requiredMethodTypes;
  requiredMethod = 'visa';
  showCcv = true;
  docUrl: any;
  submitted = false;
  public pdfViewer: any;
  gettingPrice;

  @ViewChild(CardModalComponent) cardModal: CardModalComponent
  @ViewChild(ConfirmPaymentModalComponent) confirmModal: ConfirmPaymentModalComponent

  constructor(private router: Router, private user: UserService, private sanitizer: DomSanitizer, private fb: FormBuilder
    , private toastr: ToastrService, public dialog: MatDialog, private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.createForm();
    this.user.getDocumentData().subscribe(res => {
      this.data = res.document;

      if (this.data && this.data.length) {
        this.data.forEach((element, index) => {
          this.user.getFiles(element.Thumbnail_Link).subscribe((blob) => {
            if (blob.msg === 'Fail') {
              element.thumbnail = "../../../assets/images/short_form.png";
              return;
            }
            const objectUrl = URL.createObjectURL(new Blob([blob]))
            element.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
          });
          this.user.getFiles(element.Document_Link).subscribe((blob) => {
            const objectUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
            element.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
          });
          if (index === this.data.length - 1) {
            this.data = this.data.filter((res) => res.category === "Manual")
          }
        });
      }
    })
  }

  private createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      number: ['', [
        Validators.required,
        cardValidator(this.requiredMethod, () => this.cardType),
      ], [Validators.min(13), Validators.max(16)]],
      expiry_date: ['', [
        Validators.required,
        expiryStringValidator(),
      ]]

    });
    if (this.showCcv) {
      this.form.addControl('ccv', this.fb.control('', Validators.required));
    }
  }
  get f() { return this.form.controls; }
  onExpiryKeyup($event: KeyboardEvent) {
    if (!isFinite(Number($event.key))) {
      return;
    }

    const input = $event.target as HTMLInputElement;
    const num = Number(input.value.replace(/\s\/\s/, ''));
    if (num > 1 && num < 10) {
      input.value = `0${num} / `;
    } else if (num > 12 && num < 20) {
      input.value = `01 / ${num - 10}`;
    }
  }
  onExpiryFocus($event: FocusEvent) {
    const input = $event.target as HTMLInputElement;
    input.value = input.value.replace(/\s+$/, '');
  }
  AvailableDocument() {
    this.router.navigate(['documents/availableDocument']);
  }
  manualDocument() {
    this.router.navigate(['documents/manualDocument']);
  }
  pdfdownload(fileName: string, id) {

    this.user.getFiles(fileName).subscribe((blob) => {
      if (blob.msg === 'Fail') {
        this.user.showError("File not found");
        return;
      }
      const a = document.createElement('a')
      const objectUrl = URL.createObjectURL(new Blob([blob]))
      a.href = objectUrl
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
      this.user.getSingleDocument(id).subscribe(res => {
        this.downloadasstring = res.documents.download;
        const paramas = {
          download: res.documents.download
        }
        this.user.updateDownloaddocument(id, paramas).subscribe(() => {
          this.toastr.success('Your download update Successfully ')
        });
      })
    })
  }


  editdata(id) {
    this.user.documentId = id;
  }

  editDocument(data) {
    this.user.docmentadmin = data;
    this.router.navigate(['/adddocument']);

  }

  downloadFile(data, id) {
    this.openConfirmationDialog(data, id);
  }
  openConfirmationDialog(data, id): void {
    this.data.forEach(element => {
      if (id === element.id) {
        this.gettingPrice = element.price;
      }
    });
    this.docLink = data;
    this.docid = id;
    
    this.confirmModal.open()
  }

  closeConfirmationpoup() {
    this.confirmModal.close()
  }

  onYes = () => {
    this.closeConfirmationpoup();
    this.OpenAddCardDetails();
  }
  
  onCardDetect(cardType: ICardType) {
    this.cardType = cardType || null;
    this.form.get('number').updateValueAndValidity();
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
          "poNumber": this.docid,
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
        this.closeAddCardDetails();
        this.toastr.success('Amount has been debited');
        this.pdfdownload(this.docLink, this.docid);
      }
    }, () => {
      this.closeAddCardDetails();
      this.toastr.warning('Transaction was unsucessful');
    });
  }

  closeAddCardDetails() {
    this.cardModal.close()
  }

  OpenAddCardDetails() {
    this.cardModal.open()
  }
}
