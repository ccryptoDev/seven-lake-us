import { Component, ElementRef, ViewEncapsulation } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { compileComponentFromMetadata } from "@angular/compiler";
import { User } from "./../_models";
import { Title, DomSanitizer } from "@angular/platform-browser";
import { first } from "../../../node_modules/rxjs/operators";
import {
  AuthenticationService,
  UserService,
} from "./../_services";
import { Router, Routes } from "@angular/router";
import { environment } from "../../environments/environment";
import { ColorPickerService, Cmyk } from "ngx-color-picker";
// import { CommonDialogComponent } from "../common-dialog/common-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  templateUrl: "./home.component.html",
  styleUrls: [],
  encapsulation: ViewEncapsulation.None,
})
export class MainNavComponent {
  spotlightExpand = true;
  comingUpExpand = true;
  teaserExpand = true;
  newsExpand = true;
  challengeExpand = true;
  fontBold = true;
  fontItalic = true;
  fontUnderLine = true;
  currentUser: User;
  showHideSettingIcon: boolean = false;
  // customerSpotLightContent : string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in arcu venenatis, fringilla ante ac, ullamcorper purus. In maximus ullamcorper mollis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in arcu venenatis, fringilla ante ac, ullamcorper purus. In maximus ullamcorper mollis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.';
  customerSpotLightContent: any = {
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in arcu venenatis, fringilla ante ac, ullamcorper purus. In maximus ullamcorper mollis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in arcu venenatis, fringilla ante ac, ullamcorper purus. In maximus ullamcorper mollis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
  };
  customerSpotLightName: string = "Julianne";
  //comeUpContent : string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in arcu venenatis, fringilla ante ac, ullamcorper purus. In maximus ullamcorper mollis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin vulputate lectus ullamcorper maximus cursus. Duis ut ante ante. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in arcu venenatis, fringilla ante ac, ullamcorper purus. In maximus ullamcorper mollis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin vulputate lectus ullamcorper maximus cursus. Duis ut ante ante.';
  comeUpContent: any = {};
  //affiliateContent : string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in arcu venenatis, fringilla ante ac, ullamcorper purus. In maximus ullamcorper mollis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in arcu venenatis, fringilla ante ac, ullamcorper purus. In maximus ullamcorper mollis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in arcu venenatis, fringilla ante ac, ullamcorper purus. In maximus ullamcorper mollis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in arcu venenatis, fringilla ante ac, ullamcorper purus. In maximus ullamcorper mollis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.';
  affiliateContent: any = {};
  affiliateName: string = "Julianne";
  //newsContent : string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in arcu venenatis, fringilla ante ac, ullamcorper purus. In maximus ullamcorper mollis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in arcu venenatis, fringilla ante ac,';
  newsContent: any = {};
  newsName: string = "Julianne";
  //marketChallengeContent : string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in arcu venenatis, fringilla ante ac, ullamcorper purus. In maximus ullamcorper mollis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin vulputate lectus ullamcorper maximus cursus. Duis ut ante ante. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in arcu venenatis, fringilla ante ac, ullamcorper purus. In maximus ullamcorper mollis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin vulputate lectus ullamcorper maximus cursus. Duis ut ante ante. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in arcu venenatis, fringilla ante ac, ullamcorper purus. In maximus ullamcorper mollis. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin vulputate lectus ullamcorper maximus cursus. Duis ut ante ante.';
  marketChallengeContent: any = {};
  customerSpotLightImageText: any = "";
  customerSpotLightImage: any = "../../../assets/images/user2-160x160.jpg";
  affiliateImageText: any = "";
  affiliateImage: any = "../../../assets/images/user2-160x160.jpg";
  newsImageText: any = "";
  newsImage: any = "../../../assets/images/user2-160x160.jpg";
  fontSize: number = environment.fontSize;
  // isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  //   .pipe(
  //     map(result => result.matches),
  //     shareReplay()
  //   );
  loading: boolean = false;
  dashboardData: any = [];
  customer: any;
  comeUp: any;
  affiliate: any;
  public options: Object = environment.froalaEditorKey;
  public selectedColor: string = "color1";
  public backgroundColor: string = "#2889e9";
  public foreColor: string = "#2889e9";
  public color1: string = "#2889e9";
  fontFamilyList: any = environment.fontFamily;
  fontStyleList: any = environment.fontStyleList;
  fontLineHeight: any = new Array(environment.fontLineHeight);
  fontFizeLength = new Array(environment.fontSize);
  defaultFontSize: string = "";
  defaultFontStyle: string = "";
  defaultFontFamily: string = "";
  currentElementId: string = "";
  defaultlineHeight: string = "";

  constructor(
    private breakpointObserver: BreakpointObserver,
    public router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private titleService: Title,
    private elementRef: ElementRef,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {
    this.titleService.setTitle("Dashboard");
    this.authenticationService.currentUser.subscribe((x) => {
      this.currentUser = x;
    });
  }
  counter(i: number) {
    return new Array(i);
  }
  ngOnInit() {
    // this.getDashboardData();
    if (this.currentUser == undefined || this.currentUser == null)
      this.router.navigate(["/login"]);
    if (this.userService.token === '') {
      this.userService.getZohoToken().subscribe((response) => {
        this.userService.token = response.tokenResponse.access_token;
      })
    }
  }
  onSelectImageFile(event, type) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      console.log(event.target.files[0]);
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        switch (type) {
          case "customerSpotLight":
            this.customerSpotLightImageText = event.target.result;
            this.customerSpotLightContent.image_url = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.customerSpotLightImageText
            );
            break;
          case "affiliate":
            this.affiliateImageText = event.target.result;
            this.affiliateContent.image_url = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.affiliateImageText
            );
            break;
          case "news":
            this.newsImageText = event.target.result;
            this.newsContent.image_url = this.sanitizer.bypassSecurityTrustResourceUrl(
              this.newsImageText
            );
            break;

          default:
            break;
        }
      };
    }
  }
  public domOperation() {
    let divElements = this.elementRef.nativeElement.querySelectorAll(
      "div .dynamicStyle"
    );
    let divIteration = 1;
    divElements.forEach((divElement: HTMLDivElement) => {
      divElement.addEventListener("click", this.getElementDetails.bind(this));
      divIteration++;
    });
    this.loading = false;
  }
  async updateImages() {
    let divs: any = this.elementRef.nativeElement.querySelectorAll(
      ".customerSpotLightNameContent"
    );
    // for (let i = 0; i < divs.length; i++) {
    if (this.customerSpotLightContent.description) {
      let el = document.createElement("html");
      el.innerHTML = this.customerSpotLightContent.description;
      this.customer = this.customerSpotLightContent.description;
    }
    // }
    let divs2: any = this.elementRef.nativeElement.querySelectorAll(
      ".comeUpNameContent"
    );
    // for (let i = 0; i < divs2.length; i++) {
    if (this.comeUpContent.description) {
      let el2 = document.createElement("html");
      el2.innerHTML = this.comeUpContent.description;
      this.comeUp = this.comeUpContent.description;
    }
    // }
    let divs3: any = this.elementRef.nativeElement.querySelectorAll(
      ".affiliateNameContent"
    );
    // for (let i = 0; i < divs2.length; i++) {
    if (this.affiliateContent.description) {
      let el3 = document.createElement("html");
      el3.innerHTML = this.affiliateContent.description;
      this.affiliate = this.affiliateContent.description;
    }
    // }
  }
  async updateDashboard() {
    this.loading = true;
    // await this.updateImages();
    // this.customer = this.elementRef.nativeElement.querySelectorAll(
    //   ".customerSpotLightContent");
    // let comeUp = this.elementRef.nativeElement.querySelectorAll(
    // ".comeUpContent");
    // let affiliate = this.elementRef.nativeElement.querySelectorAll(
    //   ".affiliateContent");
    let news = this.elementRef.nativeElement.querySelectorAll(".newsContent");
    let market = this.elementRef.nativeElement.querySelectorAll(
      ".marketChallengeContent"
    );
    let customeName = this.elementRef.nativeElement.querySelectorAll(
      ".customerSpotLightName"
    );
    let affiliateContentName = this.elementRef.nativeElement.querySelectorAll(
      ".affiliateName"
    );
    let newsContentName = this.elementRef.nativeElement.querySelectorAll(
      ".newsName"
    );
    // return false;
    // console.log(elements[0].innerHTML);
    // return false;
    let customerSpotLightName = ""; //customeName[0].innerHTML;
    let customerSpotLightContent = this.customerSpotLightContent.description;
    let comeUpContent = this.comeUpContent.description;
    let affiliateContent = this.affiliateContent.description;
    // let affiliateName = affiliateContentName[0].innerHTML;
    // let newsContent = news[0].innerHTML;
    //let newsName = newsContentName[0].innerHTML;
    //let marketChallengeContent = market[0].innerHTML;
    let updateData = [];
    for (let k = 0; k < this.dashboardData.length; k++) {
      if (this.dashboardData[k].dashboard_order == 1) {
        updateData.push({
          id: this.dashboardData[k].id,
          image_url: "",
          isDashboardImage:
            this.customerSpotLightImageText != null &&
              this.customerSpotLightImageText != ""
              ? true
              : false,
          dashboardImage: this.customerSpotLightImageText,
          user_id: this.currentUser.id,
          description: customerSpotLightContent,
          dashboard_id: this.dashboardData[k].dashboard_id,
          image_name: customerSpotLightName,
        });
      } else if (this.dashboardData[k].dashboard_order == 2) {
        updateData.push({
          id: this.dashboardData[k].id,
          image_url: "",
          isDashboardImage: false,
          dashboardImage: "",
          user_id: this.currentUser.id,
          description: comeUpContent,
          dashboard_id: this.dashboardData[k].dashboard_id,
          image_name: "",
        });
      } else if (this.dashboardData[k].dashboard_order == 3) {
        updateData.push({
          id: this.dashboardData[k].id,
          image_url: "",
          isDashboardImage:
            this.affiliateImageText != null && this.affiliateImageText != ""
              ? true
              : false,
          dashboardImage: this.affiliateImageText,
          user_id: this.currentUser.id,
          description: affiliateContent,
          dashboard_id: this.dashboardData[k].dashboard_id,
          image_name: "",
        });
      } else if (this.dashboardData[k].dashboard_order == 4) {
        updateData.push({
          id: this.dashboardData[k].id,
          image_url: "",
          isDashboardImage:
            this.newsImageText != null && this.newsImageText != ""
              ? true
              : false,
          dashboardImage: this.newsImageText,
          user_id: this.currentUser.id,
          description: "",
          dashboard_id: this.dashboardData[k].dashboard_id,
          image_name: "",
        });
      } else if (this.dashboardData[k].dashboard_order == 5) {
        updateData.push({
          id: this.dashboardData[k].id,
          image_url: "",
          isDashboardImage: false,
          dashboardImage: "",
          user_id: this.currentUser.id,
          description: "",
          dashboard_id: this.dashboardData[k].dashboard_id,
          image_name: "",
        });
      }
    }
    let param = { dashboard_Contents: updateData };
  }
  getDashboardData() {
    this.loading = true;
    let userId = this.currentUser.parentId;
  }

  changeDynamicStyle(event: string, data: any, actionType) {
    // var colorPicker = document.getElementById(event.target.id);
    const currentId = this.currentElementId;
    if (currentId) {
      if (event == "cpSliderDragStart" && actionType == "backgroundColor") {
        document.getElementById(currentId).style.background = data.color;
      } else if (
        event == "cpSliderDragEnd" &&
        actionType == "backgroundColor"
      ) {
        document.getElementById(currentId).style.color = data.color;
      } else if (event == "cpSliderDragStart" && actionType == "foreColor") {
        document.getElementById(currentId).style.color = data.color;
      } else if (event == "cpSliderDragEnd" && actionType == "foreColor") {
        document.getElementById(currentId).style.color = data.color;
      } else if (actionType == "fontFamily") {
        document.getElementById(
          currentId
        ).style.fontFamily = this.defaultFontFamily;
        this.defaultFontFamily = "";
      } else if (actionType == "fontSize") {
        document.getElementById(currentId).style.fontSize =
          this.defaultFontSize + "px";
        this.defaultFontSize = "";
      } else if (actionType == "bold") {
        document.getElementById(currentId).style.fontWeight = "900";
        document.getElementById(currentId).style.textDecoration = "none";
      } else if (actionType == "italic") {
        document.getElementById(currentId).style.fontWeight = "100";
        document.getElementById(currentId).style.fontStyle = "italic";
        document.getElementById(currentId).style.textDecoration = "none";
        this.fontItalic = !this.fontItalic;
      } else if (actionType == "underline") {
        document.getElementById(currentId).style.textDecoration =
          "underline overline";
      } else if (actionType == "bold italic") {
        document.getElementById(currentId).style.fontWeight = "900";
        document.getElementById(currentId).style.fontStyle = "italic";
        document.getElementById(currentId).style.textDecoration = "none";
      } else if (actionType == "regular") {
        document.getElementById(currentId).style.fontWeight = "100";
        document.getElementById(currentId).style.fontStyle = "normal";
        document.getElementById(currentId).style.textDecoration = "none";
      } else if (actionType == "lineHeight") {
        document.getElementById(currentId).style.lineHeight =
          this.defaultlineHeight + "px";
      }
    } else {
      this.userService.showError("Please select any one of the section");
    }
  }
  getElementDetails(event) {
    console.log(event.target.id);
    this.currentElementId = event.target.id;
  }
}
