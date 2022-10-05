import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs/internal/Observable";
import { UserService } from "../_services";
import { PaymentService } from "../_services/payment.service";

@Component({
  selector: "app-main-search-bar",
  templateUrl: "./main-search-bar.component.html",
  styleUrls: ["./main-search-bar.component.scss"],
})
export class MainSearchBarComponent implements OnInit {
  pdfName: string = "";
  data: any;
  documentData: any;
  downloadasstring;
  fileName = "sample.pdf";
  newfile: [] = [];
  thumbnail: string;
  filter = "Manual";
  docLink = "";
  docid = "";
  docUrl: any;
  public pdfViewer: any;
  private gettingSuccesspayment;
  private takePaymentTransId;

  public startedPlay: boolean = false;
  duration;
  myVideo = document.createElement("my_video_1");
  watingcondition = true;
  currentTime: number;
  public show: boolean = false;
  $user;
  $document;

  anotherdata: any[];

  videobtnvisible = false;
  selectData: any;
  // filter = 'Application';
  img =
    "https://alchemylms-staging.s3.us-west-2.amazonaws.com/Development/seven-lake/frunt.jpg";

  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;

  @ViewChild("addCardDetails") addCardDetails: TemplateRef<any>;
  private addCardDetailsRef: MatDialogRef<TemplateRef<any>>;

  @ViewChild("confirmationPopupManual")
  confirmationPopupManual: TemplateRef<any>;
  private confirmationPopupManualRef: MatDialogRef<TemplateRef<any>>;

  constructor(
    private router: Router,
    private user: UserService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private paymentService: PaymentService
  ) {}
  ngOnInit(): void {
    console.log(this.user.userDetails.Member_Number);
    this.user.MainsearchTag.subscribe((MainSearch) => {
      console.log("MainSearch", MainSearch);
      this.$user = MainSearch;
      this.gettingVideos();
    });
    this.user.DocumentServiceTag.subscribe((searchResults) => {
      if (searchResults?.documents) {
        this.$document = searchResults?.documents;
        this.getDocument();
      }

      if (searchResults?.videos) {
        this.$user = searchResults?.videos;
        this.gettingVideos();
      }
    });

    if (
      this.user.userDetails.Account_Type === "AAM Internal" ||
      this.user.userDetails.Account_Type === "Admin" ||
      this.user.userDetails.Account_Type === "ADMIN"
    ) {
      this.videobtnvisible = true;
    }
    this.gettingVideos();
    this.getDocument();
  }
  gettingVideos() {
    this.data = this.$user;
    if (this.data && this.data.length) {
      this.data.forEach((element, index) => {
        this.user.getFiles(element.Thumbnail_Link).subscribe((blob) => {
          if (blob.msg === "Fail") {
            element.thumbnail = "../../../assets/images/short_form.png";
            return;
          }
          const objectUrl = URL.createObjectURL(new Blob([blob]));
          element.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        });
        this.user.getFiles(element.Video_Link).subscribe((blob) => {
          const objectUrl = URL.createObjectURL(new Blob([blob]));
          element.VideoUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        });
      });
    }
    for (var i = 0; i < this.data.length; i++) {
      const a = this.data[i];
      this.thumbnail = a.Video_Link;
    }
  }
  getDocument() {
    this.documentData = this.$document;

    if (this.documentData && this.documentData.length) {
      this.documentData.forEach((element, index) => {
        this.user.getFiles(element.Thumbnail_Link).subscribe((blob) => {
          if (blob.msg === "Fail") {
            element.thumbnail = "../../../assets/images/short_form.png";
            return;
          }
          const objectUrl = URL.createObjectURL(new Blob([blob]));
          element.thumbnail = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        });
        this.user.getFiles(element.Document_Link).subscribe((blob) => {
          const objectUrl = URL.createObjectURL(
            new Blob([blob], { type: "application/pdf" })
          );
          element.documentUrl =
            this.sanitizer.bypassSecurityTrustResourceUrl(objectUrl);
        });
      });
    }

    console.log(this.documentData);
    for (var i = 0; i < this.documentData.length; i++) {
      const a = this.documentData[i];
      this.thumbnail = a.Video_Link;
    }
  }
  editdata(id) {
    this.user.docmentadmin = id;
  }
  checkForSubscribe() {
    if (this.gettingSuccesspayment != undefined) {
      var myVideo: any = document.getElementById("my_video_1");
      myVideo.play();
      this.watingcondition = true;
      return;
    }
  }
  getsingleVideo(id) {
    this.selectData = this.data.filter((x) => x.id === id);
    console.log(this.selectData);
  }

  // currenttime
  setCurrentTime(data) {
    this.duration = data.target.duration;
    var myVideo: any = document.getElementById("my_video_1");
    this.currentTime = data.target.currentTime;
    console.log(this.currentTime);
    if (this.currentTime > 15.0) {
      myVideo.pause();
      this.watingcondition = false;
      myVideo.reset();
      myVideo.ended();
      myVideo.load();
    }
    this.watingcondition = true;
  }

  pdfdownload(fileName: string, id) {
    this.user.getFiles(fileName).subscribe((blob) => {
      if (blob.msg === "Fail") {
        this.user.showError("File not found");
        return;
      }
      const a = document.createElement("a");
      const objectUrl = URL.createObjectURL(new Blob([blob]));
      a.href = objectUrl;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
      this.user.getSingleDocument(id).subscribe((res) => {
        console.log(res.documents.download);
        this.downloadasstring = res.documents.download;
        const paramas = {
          download: res.documents.download,
        };
        this.user.updateDownloaddocument(id, paramas).subscribe(() => {
          this.toastr.success("Your download update Successfully ");
        });
      });
    });
  }

  downloadFile(data, id) {
    this.openConfirmationDialog();
  }

  openConfirmationDialog(): void {
    // this.docLink=data;
    // this.docid=id;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.restoreFocus = false;
    dialogConfig.autoFocus = false;
    dialogConfig.role = "dialog";

    this.confirmationPopupManualRef = this.dialog.open(
      this.confirmationPopupManual,
      dialogConfig
    );

    this.confirmationPopupManualRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed...");
    });
  }

  closeConfirmationpoup() {
    this.confirmationPopupManualRef.close();
  }

  onYes() {
    this.OpenAddCardDetails();
    this.closeConfirmationpoup();
  }

  onSubmit() {
    var paramdata = {
      createTransactionRequest: {
        merchantAuthentication: {
          name: "6LrckQ3F3MZ9",
          transactionKey: "525Gk3FQge24EuVY",
        },
        refId: "1123456",
        transactionRequest: {
          transactionType: "authOnlyTransaction",
          amount: "1",
          payment: {
            creditCard: {
              cardNumber: (<HTMLInputElement>document.getElementById("cardNo"))
                .value,
              expirationDate: (<HTMLInputElement>(
                document.getElementById("expdate")
              )).value,
              cardCode: (<HTMLInputElement>document.getElementById("cvv"))
                .value,
            },
          },
          lineItems: {
            lineItem: {
              itemId: "1",
              name: "vase",
              description: "Cannes logo",
              quantity: "18",
              unitPrice: "45.00",
            },
          },
          tax: {
            amount: "4.26",
            name: "level2 tax name",
            description: "level2 tax",
          },
          duty: {
            amount: "8.55",
            name: "duty name",
            description: "duty description",
          },
          shipping: {
            amount: "4.26",
            name: "level2 tax name",
            description: "level2 tax",
          },
          poNumber: "456654",
          customer: {
            id: "99999456654",
          },
          billTo: {
            firstName: "Ellen",
            lastName: "Johnson",
            company: "Souveniropolis",
            address: "14 Main Street",
            city: "Pecan Springs",
            state: "TX",
            zip: "44628",
            country: "US",
          },
          shipTo: {
            firstName: "China",
            lastName: "Bayles",
            company: "Thyme for Tea",
            address: "12 Main Street",
            city: "Pecan Springs",
            state: "TX",
            zip: "44628",
            country: "US",
          },
          customerIP: "192.168.1.1",
          userFields: {
            userField: [
              {
                name: "MerchantDefinedFieldName1",
                value: "MerchantDefinedFieldValue1",
              },
              {
                name: "favorite_color",
                value: "blue",
              },
            ],
          },
          processingOptions: {
            isSubsequentAuth: "true",
          },
          subsequentAuthInformation: {
            originalNetworkTransId: "123456789NNNH",
            originalAuthAmount: "45.00",
            reason: "resubmission",
          },
          authorizationIndicatorType: {
            authorizationIndicator: "pre",
          },
        },
      },
    };
    this.paymentService.authorizeCC(paramdata).subscribe(
      (x) => {
        console.log(x);
        if (x != null && x.messages.resultCode === "Ok") {
          var paramData2 = {
            createTransactionRequest: {
              merchantAuthentication: {
                name: "6LrckQ3F3MZ9",
                transactionKey: "525Gk3FQge24EuVY",
              },
              refId: "123456",
              transactionRequest: {
                transactionType: "authCaptureTransaction",
                amount: "5",
                payment: {
                  bankAccount: {
                    accountType: "checking",
                    routingNumber: "121042882",
                    accountNumber: (<HTMLInputElement>(
                      document.getElementById("cardNo")
                    )).value,
                    nameOnAccount: (<HTMLInputElement>(
                      document.getElementById("username")
                    )).value,
                  },
                },
                lineItems: {
                  lineItem: {
                    itemId: "1",
                    name: "vase",
                    description: "Cannes logo",
                    quantity: "18",
                    unitPrice: "45.00",
                  },
                },
                tax: {
                  amount: "4.26",
                  name: "level2 tax name",
                  description: "level2 tax",
                },
                duty: {
                  amount: "8.55",
                  name: "duty name",
                  description: "duty description",
                },
                shipping: {
                  amount: "4.26",
                  name: "level2 tax name",
                  description: "level2 tax",
                },
                poNumber: "456654",
                billTo: {
                  firstName: "Ellen",
                  lastName: "Johnson",
                  company: "Souveniropolis",
                  address: "14 Main Street",
                  city: "Pecan Springs",
                  state: "TX",
                  zip: "44628",
                  country: "US",
                },
                shipTo: {
                  firstName: "China",
                  lastName: "Bayles",
                  company: "Thyme for Tea",
                  address: "12 Main Street",
                  city: "Pecan Springs",
                  state: "TX",
                  zip: "44628",
                  country: "US",
                },
                customerIP: "192.168.1.1",
              },
            },
          };
          this.paymentService.debitamountFromBank(paramData2).subscribe(
            (y) => {
              if (y != null && y.messages.resultCode === "Ok") {
                var data = {
                  transid: y.transactionResponse.transactionId,
                  memberId: this.user.userDetails.Member_Number,
                };
                this.pdfdownload(this.docLink, this.docid);
                if (data != undefined) {
                  this.paymentService
                    .storePaymentTransId(data)
                    .subscribe((res) => {
                      console.log(res);
                      this.toastr.success("you reqid generated");
                    });
                }
                this.closeAddCardDetails();
                this.toastr.success("Amount has been debited");

                // this.pdfdownload(this.docLink, this.docid);
              } else {
                this.closeAddCardDetails();
                this.toastr.warning("Transaction was unsucessful");
              }
            },
            () => {
              this.closeAddCardDetails();
              this.toastr.warning("Transaction was unsucessful");
            }
          );
        } else {
          this.closeAddCardDetails();
          this.toastr.warning("Transaction was unsucessful");
        }
      },
      () => {
        this.closeAddCardDetails();
        this.toastr.warning("Transaction was unsucessful");
      }
    );
  }

  closeAddCardDetails() {
    this.addCardDetailsRef.close();
  }
  OpenAddCardDetails() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.restoreFocus = false;
    dialogConfig.autoFocus = false;
    dialogConfig.role = "dialog";

    this.addCardDetailsRef = this.dialog.open(
      this.addCardDetails,
      dialogConfig
    );

    this.addCardDetailsRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed...");
    });
  }
}
