import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/_services';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PaymentService } from 'src/app/_services/payment.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from 'ngx-editor';
import CardModalComponent from 'src/app/paments/card-modal/card-modal.component';
import ConfirmPaymentModalComponent from 'src/app/paments/confirm-payment/confirm-payment.component';
import { environment } from 'src/environments/environment';
import { UserDetails } from 'src/app/types/user-details.type';

@Component({
  selector: 'app-available-document',
  templateUrl: './available-document.component.html',
  styleUrls: ['./available-document.component.scss']
})
export class AvailableDocumentComponent implements OnInit {
  form: FormGroup;
  data: any;
  fileName = "sample.pdf";
  newfile: [] = [];
  downloadData: any[] = [];
  downloadasstring;
  thumbnail: string;
  filter = 'Application';
  docLink = '';
  docid = '';
  gettingPrice;

  @ViewChild(CardModalComponent) cardModal: CardModalComponent
  @ViewChild(ConfirmPaymentModalComponent) confirmModal: ConfirmPaymentModalComponent

  private addCardDetailsRef: MatDialogRef<TemplateRef<any>>;
  private confirmationPopupManualRef: MatDialogRef<TemplateRef<any>>;
  img = 'https://alchemylms-staging.s3.us-west-2.amazonaws.com/Development/seven-lake/frunt.jpg'
  constructor(private user: UserService, private fb: FormBuilder, private paymentService: PaymentService, private toastr: ToastrService, public dialog: MatDialog, private sanitizer: DomSanitizer, private tostr: ToastrService, private router: Router) { }


  ngOnInit(): void {
    this.createForm();
    this.user.getDocumentData().subscribe(res => {
      this.data = res.document;
      this.data = this.data.filter((res) => res.category === "Application")
      this.downloadData = this.data;
      this.data.forEach((element) => {
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
      });

      for (var i = 0; i < res.document.length; i++) {
        const a = res.document[i];
        this.thumbnail = a.Thumbnail_Link;
      }
    })
  }

  private createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      number: ['', [
        Validators.required,
      ]],
      expiry_date: ['', [
        Validators.required,
      ]],
      ccv: ['']
    });
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
        this.cardModal.close();
        this.toastr.success('Amount has been debited');
        this.pdfdownload(this.docLink, this.docid);
      }
    }, () => {
      this.cardModal.close();
      this.toastr.warning('Transaction was unsucessful');
    });
  }
  
  editDocument(data) {
    this.user.docmentadmin = data;
    this.router.navigate(['/adddocument']);
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
          this.tostr.success('Your download update Successfully ')
        });
      })

    })
  }
  downloadFile(data, id) {
    this.openConfirmationDialog(data, id);
  }
  onYes = () => {
    this.closeConfirmationpoup();
    this.OpenAddCardDetails();
  }

  OpenAddCardDetails() {
    this.cardModal.open()
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
    this.confirmModal.close();
  }
  
  closeAddCardDetails() {
    this.cardModal.close();
  }

}
