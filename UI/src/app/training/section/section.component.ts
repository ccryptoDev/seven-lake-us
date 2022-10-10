import { Component, ElementRef, Input, OnInit, ViewChild, } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from 'src/app/_services';
import { PaymentService } from 'src/app/_services/payment.service';
import { ToastrService } from 'ngx-toastr';
import { VideoType } from 'src/app/types/video.type';
import CardModalComponent from 'src/app/paments/card-modal/card-modal.component';
import ConfirmPaymentModalComponent from 'src/app/paments/confirm-payment/confirm-payment.component';
import { environment } from 'src/environments/environment';
import { UserDetails } from 'src/app/types/user-details.type';

@Component({
  selector: 'app-training-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionTrainingComponent implements OnInit{
  @Input() filterData: Function;
  @Input() sectionName: string = "Sales"

  data: VideoType[];
  pdfName: string = "";
  duration
  currentTime: number;
  isVideoAllowed = true;
  hasPaid = false;
  fileName = "sample.pdf";
  newfile: [] = []
  thumbnail: string;
  isAdmin = false;
  selectedItem: VideoType;
  searchText = '';
  img = 'https://alchemylms-staging.s3.us-west-2.amazonaws.com/Development/seven-lake/frunt.jpg';

  preloadCounter = 0;
  metadata: Record<string, number> = {};

  public startedPlay: boolean = false;
  myVideo = document.createElement("my_video_1");
  public show: boolean = false;

  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;

  @ViewChild(CardModalComponent) cardModal: CardModalComponent
  @ViewChild(ConfirmPaymentModalComponent) confirmModal: ConfirmPaymentModalComponent
  constructor(
    private user: UserService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private paymentService: PaymentService
  ) { }


  ngOnInit(): void {

    if (this.user.userDetails.Account_Type === 'AAM Internal' || this.user.userDetails.Account_Type === 'Admin' || this.user.userDetails.Account_Type === 'ADMIN') {
      this.isAdmin = true;
    }

    this.user.getVideosV2().subscribe(res => {
      this.data = this.filterData(res)

      if (this.data && this.data.length) {
        this.data.forEach((element) => {
          element.thumbnailURL = this.sanitizer.bypassSecurityTrustUrl(element.thumbnailURL.toString());
          element.videoURL = this.sanitizer.bypassSecurityTrustUrl(element.videoURL.toString());
        });
      }

      for (let i = 0; i < this.data.length; i++) {
        this.thumbnail = this.data[i].videoURL.toString();
      }
    });
  }

  selectItem(id: string) {
    this.selectedItem = this.data.find(x => x.id === id);
  }

  pdfdownload(fileName: string) {
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
    })
  }
  playPause() {
    var myVideo: any = document.getElementById("my_video_1");
    if (myVideo.paused) myVideo.play();
    else myVideo.pause();
  }
  setCurrentTime(data) {
    this.duration = data.target.duration;
    var myVideo: any = document.getElementById("my_video_1");
    this.currentTime = data.target.currentTime;
    if (this.currentTime > 15.000000 && !this.hasPaid) {
      myVideo.pause();
      this.isVideoAllowed = false;
      myVideo.reset();
      myVideo.ended();
    }
  }

  downloadFile(data, id) {
    this.openConfirmationDialog();
  }

  openConfirmationDialog(): void {
    this.confirmModal.open()
  }

  closeConfirmationpoup() {
    this.confirmModal.close()
  }

  confirmPayment = () => {
    this.OpenAddCardDetails();
  }

  onVideoLoad(videoId: string) {
    const video = document.getElementById(`#player-${videoId}`) as HTMLVideoElement
    this.metadata[videoId] = Math.floor(video.duration) || 1
    this.preloadCounter += 1
  }

  getDuration(videoId: string): string {
    const padNumber = (n: number) => n.toString().padStart(2, '0')

    const duration = this.metadata[videoId]
    const minutes = Math.floor(duration / 60)
    const seconds = duration - minutes * 60
    return `${padNumber(minutes)}:${padNumber(seconds)}`
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
          "poNumber": 1,
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
        this.hasPaid = true
      }
    }, () => {
      this.closeAddCardDetails();
      this.toastr.warning('Transaction was unsucessful');
    });
  }

  closeAddCardDetails() {
    this.cardModal.close();
  }
  OpenAddCardDetails() {
    this.cardModal.open()
  }

}