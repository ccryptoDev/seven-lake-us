import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Validators } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import CardModalComponent from 'src/app/paments/card-modal/card-modal.component';
import ConfirmPaymentModalComponent from 'src/app/paments/confirm-payment/confirm-payment.component';
import { UserDetails } from 'src/app/types/user-details.type';
import { UserService } from 'src/app/_services';
declare var require: any
import { PaymentService } from 'src/app/_services/payment.service';
import { environment } from 'src/environments/environment';
const FileSaver = require('file-saver');
@Component({
  selector: 'app-flyers',
  templateUrl: './flyers.component.html',
  styleUrls: ['./flyers.component.scss']
})
export class FlyersComponent implements OnInit {
  pdfName: string = "";
  data: any;
  fileName = "sample.pdf";
  docLink = '';
  docid = '';
  form: FormGroup;
  newfile: [] = []
  thumbnail: string;
  filter = 'Application';
  downloadasstring: any;
  gettingPrice;

  @ViewChild(CardModalComponent) cardModal: CardModalComponent
  @ViewChild(ConfirmPaymentModalComponent) confirmModal: ConfirmPaymentModalComponent

  constructor(private user: UserService, private fb: FormBuilder, public dialog: MatDialog, private toastr: ToastrService, public paymentService: PaymentService, private sanitizer: DomSanitizer, private tostr: ToastrService) { }

  ngOnInit(): void {
    this.user.getDocumentData().subscribe(res => {
      console.log(res.document)
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
          this.data = this.data.filter((res) => res.category === "Flyers")
          if (index === this.data.length - 1) {
            this.data = this.data.filter((res) => res.category === "Flyers")
          }
        });
      }
      console.log(this.data);
      for (var i = 0; i < res.document.length; i++) {
        const a = res.document[i];

        this.thumbnail = a.Thumbnail_Link;
        this.pdfName = a.Document_Link;
      }
      this.pdfName = res.document.Document_Link;
    })
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
        console.log(res.documents.download);
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
  editdata(id) {
    this.user.docmentadmin = id;
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

  onYes = () => {
    this.closeConfirmationpoup();
    this.OpenAddCardDetails();
  }

  closeConfirmationpoup() {
    this.confirmModal.close()
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

  OpenAddCardDetails() {
    this.cardModal.open()
  }

  closeAddCardDetails() {
    this.cardModal.close();
  }

}
