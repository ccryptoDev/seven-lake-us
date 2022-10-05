import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';
import CardModalComponent from 'src/app/paments/card-modal/card-modal.component';
import ConfirmPaymentModalComponent from 'src/app/paments/confirm-payment/confirm-payment.component';
import { UserService } from 'src/app/_services';
import { PaymentService } from 'src/app/_services/payment.service';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss']
})
export class SocialMediaComponent implements OnInit {
  pdfName: string = "";
  docLink = '';
  docid = '';
  data: any;
  fileName = "sample.pdf";
  newfile: [] = []
  thumbnail: string;
  filter = 'Application';
  downloadasstring: any;
  form: FormGroup
  gettingPrice;

  @ViewChild(CardModalComponent) cardModal: CardModalComponent
  @ViewChild(ConfirmPaymentModalComponent) confirmModal: ConfirmPaymentModalComponent

  constructor(private user: UserService, private toastr: ToastrService, public paymentService: PaymentService, public dialog: MatDialog, private sanitizer: DomSanitizer, private tostr: ToastrService) { }

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
            const objectUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' })) + '#toolbar=0&navpanes=0';
            element.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
          });
          if (index === this.data.length - 1) {
            this.data = this.data.filter((res) => res.category === "Social Media")
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
  editdata(id) {
    this.user.docmentadmin = id;
  }

  closeConfirmationpoup() {
    this.confirmModal.close()
  }

  onYes = () => {
    this.closeConfirmationpoup();
    this.openAddCardDetails();
  }

  onSubmit = () => {
    var paramdata = {
      "createTransactionRequest": {
        "merchantAuthentication": {
          "name": "6LrckQ3F3MZ9",
          "transactionKey": "525Gk3FQge24EuVY"
        },
        "refId": "1123456",
        "transactionRequest": {
          "transactionType": "authOnlyTransaction",
          "amount": "1",
          "payment": {
            "creditCard": {
              "cardNumber": this.cardModal.creditCard.cardNumber.toString(),
              "expirationDate": this.cardModal.creditCard.expiryDate.toString(),
              "cardCode": this.cardModal.creditCard.CVV.toString()
            }
          },
          "lineItems": {
            "lineItem": {
              "itemId": "1",
              "name": "vase",
              "description": "Cannes logo",
              "quantity": "18",
              "unitPrice": "45.00"
            }
          },
          "tax": {
            "amount": "4.26",
            "name": "level2 tax name",
            "description": "level2 tax"
          },
          "duty": {
            "amount": "8.55",
            "name": "duty name",
            "description": "duty description"
          },
          "shipping": {
            "amount": "4.26",
            "name": "level2 tax name",
            "description": "level2 tax"
          },
          "poNumber": "456654",
          "customer": {
            "id": "99999456654"
          },
          "billTo": {
            "firstName": "Ellen",
            "lastName": "Johnson",
            "company": "Souveniropolis",
            "address": "14 Main Street",
            "city": "Pecan Springs",
            "state": "TX",
            "zip": "44628",
            "country": "US"
          },
          "shipTo": {
            "firstName": "China",
            "lastName": "Bayles",
            "company": "Thyme for Tea",
            "address": "12 Main Street",
            "city": "Pecan Springs",
            "state": "TX",
            "zip": "44628",
            "country": "US"
          },
          "customerIP": "192.168.1.1",
          "userFields": {
            "userField": [
              {
                "name": "MerchantDefinedFieldName1",
                "value": "MerchantDefinedFieldValue1"
              },
              {
                "name": "favorite_color",
                "value": "blue"
              }
            ]
          },
          "processingOptions": {
            "isSubsequentAuth": "true"
          },
          "subsequentAuthInformation": {
            "originalNetworkTransId": "123456789NNNH",
            "originalAuthAmount": "45.00",
            "reason": "resubmission"
          },
          "authorizationIndicatorType": {
            "authorizationIndicator": "pre"
          }
        }
      }


    }
    this.paymentService.authorizeCC(paramdata).subscribe(x => {
      console.log(x);
      if (x != null && x.messages.resultCode === 'Ok') {

        var paramData2 = {
          "createTransactionRequest": {
            "merchantAuthentication": {
              "name": "6LrckQ3F3MZ9",
              "transactionKey": "525Gk3FQge24EuVY"
            },
            "refId": "123456",
            "transactionRequest": {
              "transactionType": "authCaptureTransaction",
              "amount": "5",
              "payment": {
                "bankAccount": {
                  "accountType": "checking",
                  "routingNumber": "121042882",
                  "accountNumber": this.cardModal.creditCard.cardNumber.toString(),
                  "nameOnAccount": this.cardModal.creditCard.holderName.toString()
                }
              },
              "lineItems": {
                "lineItem": {
                  "itemId": "1",
                  "name": "vase",
                  "description": "Cannes logo",
                  "quantity": "18",
                  "unitPrice": "45.00"
                }
              },
              "tax": {
                "amount": "4.26",
                "name": "level2 tax name",
                "description": "level2 tax"
              },
              "duty": {
                "amount": "8.55",
                "name": "duty name",
                "description": "duty description"
              },
              "shipping": {
                "amount": "4.26",
                "name": "level2 tax name",
                "description": "level2 tax"
              },
              "poNumber": "456654",
              "billTo": {
                "firstName": "Ellen",
                "lastName": "Johnson",
                "company": "Souveniropolis",
                "address": "14 Main Street",
                "city": "Pecan Springs",
                "state": "TX",
                "zip": "44628",
                "country": "US"
              },
              "shipTo": {
                "firstName": "China",
                "lastName": "Bayles",
                "company": "Thyme for Tea",
                "address": "12 Main Street",
                "city": "Pecan Springs",
                "state": "TX",
                "zip": "44628",
                "country": "US"
              },
              "customerIP": "192.168.1.1"
            }
          }
        }
        this.paymentService.debitamountFromBank(paramData2).subscribe(y => {
          if (y != null && y.messages.resultCode === 'Ok') {
            this.closeAddCardDetails();
            this.toastr.success('Amount has been debited');
            this.pdfdownload(this.docLink, this.docid);
          }
          else {
            this.closeAddCardDetails();
            this.toastr.warning('Transaction was unsucessful');
          }
        }, () => {
          this.closeAddCardDetails();
          this.toastr.warning('Transaction was unsucessful');
        });
      }
      else {
        this.closeAddCardDetails();
        this.toastr.warning('Transaction was unsucessful');
      }

    }, () => {
      this.closeAddCardDetails();
      this.toastr.warning('Transaction was unsucessful');
    });

  }
  openAddCardDetails = () => {
    this.cardModal.open()
  }

  closeAddCardDetails() {
    this.cardModal.close()
  }
}
