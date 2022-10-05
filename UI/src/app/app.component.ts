import { Component, ViewChild, HostListener, ElementRef, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService, UserService } from "./_services";
import { User } from "./_models";
import { Title } from "@angular/platform-browser";
import { first } from "rxjs/operators";
import { UserDetails } from "./types/user-details.type";
import { isAdmin, isOfficeMember } from "./utils/roleUtils";
import { SideBarComponent } from "./sidebar/sidebar.component";

@Component({
  selector: "app",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.css"],
})
export class AppComponent implements OnInit {
  MainsearchTag;
  dash_heading;
  changeColorPicker: any;
  currentUser: User;
  GetVideo;
  GetDocument;
  toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
  currentTheme = localStorage.getItem("theme");
  buttonTheme = localStorage.getItem("btn");
  largesSidebarWrapper = true;
  smallSidebarWrapper = false;
  sidebarColor;
  headerBrandColor;
  headerColor;
  fromApiGettingColor;

  @ViewChild(SideBarComponent) sideBar: SideBarComponent

  // side menu - end
  first_name: string;
  last_name: string;
  isExpanded = true;
  showSubmenu = false;
  ParentSubmenu = false;
  isShowing = false;
  gettingAccountOffice;
  showSubSubMenu = false;
  showAccountSub = false;
  showCalendarSub = false;
  showcalendarSub = false;
  showEmailSub = false;
  showLeadSub = false;
  showPromoSub = false;
  showWebsiteSub = false;
  showContentSub = false;
  toggleSwitchchecked = false;
  changeColor = false;
  isNavOpen = false;
  userDetails: any = {};
  data = "";
  sessionTimeOutVal: any;
  openToggel = false;
  currentUrl = "home";
  whiteBanner = false;
  officeNameList: any;
  example1 = [];
  users: any[];
  filteredUsers: any[];
  mainSearchBar: any = "tata";
  filterBy;
  bgColor = null;
  curOffice: any;
  ChangeTextColor: any[] = [];
  setClasses: "";
  setClass: "";
  setHeaderColor: "";
  getClickValue: "";
  SelectedPageDefaultEmail = [];
  selectedLevelForEmail = "choose your Office";
  dropValdata: any;
  @ViewChild("select") select: ElementRef;
  officeData: any = [];

  get ownerEmail() { return this.userService.userDetails?.Owner?.email; }
  get ownerName() { return this.userService.userDetails?.Owner?.name }
  get passType() { return this.userService.userDetails?.Account_Type; }
  get Phone() { return this.userService.userDetails?.Mobile_Phone; }
  get nameUser() { return this.userService.userDetails && this.userService.userDetails?.Name; }
  get officeName() { return this.userService.userDetails?.Office; }

  constructor(
    public router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private titleService: Title,
    private sanitizer: DomSanitizer,
    public toster: ToastrService
  ) {
    this.titleService.setTitle("FinanceAgents");
    this.authenticationService.currentUser.subscribe((user) => {
      this.currentUser = user;

      const userEmail = this.getUserEmail(user);

      this.userService.setEmail(userEmail);

      if (this.currentUser != null) {
        this.first_name = this.currentUser.firstName;
        this.last_name = this.currentUser.lastName;

        if (this.currentUser && !this.userService.userDetails) {
          const storageUser = localStorage.getItem('UserDetails')
          if(storageUser)
          this.userService.userDetails = JSON.parse(storageUser)
        }

        this.userService.getAgentsByEmail().subscribe((result) => {
          if (result && result.agent && result.agent.length) {
            const user = result.agent[0]
            this.userService.userDetails = user;
            localStorage.setItem('UserDetails', JSON.stringify(user));
          }
        });
      }

      if (user) {
        this.setColors()
      } else {
        this.resetColors()
      }
      
    });
    this.authenticationService.MenuHideAndShow.subscribe((x) => {
      if (x != null) {
        if (Array.isArray(x) && x.length) {
          this.isExpanded = x[0].hideAndShow;
        }
      }
    });
  }

  getUserEmail(data: User | string) {
    if (typeof data === "string") {
      return data;
    } else {
      return data?.email;
    }
  }

  setColors() {
    this.userService.gettingColorCode().subscribe((data) => {
      this.userService.getOfficeNameFromApi().subscribe((res) => {
        this.SelectedPageDefaultEmail = res.officeData;
      });

      if (data !== "" || data !== undefined) {
        let findingOffice;
        const finaldata = data.GettingcolotCode;
        this.officeData = finaldata;

        findingOffice = finaldata.filter(
          (res) => res.AccountType === this.userService.userDetails?.Office
        );

        document.documentElement.setAttribute("header-color2", "headerBrand3");
        document.documentElement.setAttribute("header-color", "sidebarcolor3");
        document.documentElement.setAttribute("header-color1", "header3");
        const bodyStyles = document.getElementsByTagName("html")[0].style;

        const firstOffice = findingOffice[0];

        if (firstOffice) {
          bodyStyles.setProperty("--anchorbg", firstOffice.sideBarColor);
          bodyStyles.setProperty("--headerbg", firstOffice.headerBrandColor);
          bodyStyles.setProperty("--headersidebg", firstOffice.headerColor);

          this.gettingAccountOffice = firstOffice.AccountType;
          this.sidebarColor = firstOffice.sideBarColor;
          this.headerColor = firstOffice.headerColor;
          this.headerBrandColor = firstOffice.headerBrandColor;
        }
      }
    });
  }

  resetColors() {
    const bodyStyles = document.getElementsByTagName("html")[0].style

    bodyStyles.removeProperty("--anchorbg")
    bodyStyles.removeProperty("--headerbg")
    bodyStyles.removeProperty("--headersidebg")

    this.gettingAccountOffice = null
    this.sidebarColor = null
    this.headerColor = null
    this.headerBrandColor = null
  }


  async ngOnInit() {
    this.setColors();
    this.sideMenu();

    if (this.currentTheme) {
      document.documentElement.setAttribute("data-theme", this.currentTheme);
    }
    if (this.buttonTheme) {
      document.documentElement.setAttribute("data-theme", this.buttonTheme);
    }

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.currentUrl = val.url;
        this.whiteBanner =
          val.url === "/addVideos" ||
          val.url === "/addformmanager" ||
          val.url === "/addOffice" ||
          val.url === "/urlFormManager" ||
          val.url === "/adddocument" ||
          val.url === "/edit-agent" ||
          val.url === "/edittemplates" ||
          val.url === "/edit-leads";
      }
      // see also
    });
    this.getLogo();
  }

  dropChangeVal() {
    this.dropValdata = this.select.nativeElement.value;
  }

  toLargeSidebar() {
    this.smallSidebarWrapper = false;
    this.largesSidebarWrapper = true;
  }
  toSmallSidebarWrraper() {
    this.smallSidebarWrapper = true;
    this.largesSidebarWrapper = false;
  }

  @HostListener("window:mousemove") refreshUserState() {
    // clearTimeout(this.sessionTimeOutVal);
    // this.sessionTimeout();
  }
  switchTheme(e) {
    // this.themeService.toggle();
    if (this.toggleSwitchchecked === true) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
    this.toggleSwitchchecked = !this.toggleSwitchchecked;
  }

  changeAnchorColorsOne() {
    this.sidebarColor = "#45B7D9";
    document.documentElement.setAttribute("header-color", "sidebarcolor1");
    document
      .getElementsByClassName("sidebarcolor2")[0]
      ?.removeAttribute("sidebarcolor2");
    document
      .getElementsByClassName("sidebarcolor3")[0]
      ?.removeAttribute("sidebarcolor3");
  }

  changeAnchorColorsTwo() {
    this.sidebarColor = "#6ECAE6";
    document.documentElement.setAttribute("header-color", "sidebarcolor2");
    document
      .getElementsByClassName("sidebarcolor1")[0]
      ?.removeAttribute("sidebarcolor1");
    document
      .getElementsByClassName("sidebarcolor3")[0]
      ?.removeAttribute("sidebarcolor3");
  }
  changeAnchorColorThird(e) {
    this.sidebarColor = e;
    document.documentElement.setAttribute("header-color", "sidebarcolor3");
    // document.documentElement.setAttribute("style", "background-color:${};");

    document
      .getElementsByClassName("sidebarcolor1")[0]
      ?.removeAttribute("sidebarcolor1");
    document
      .getElementsByClassName("sidebarcolor2")[0]
      ?.removeAttribute("sidebarcolor2");
    const bodyStyles = document.getElementsByTagName("html")[0].style;
    bodyStyles.setProperty("--anchorbg", e);
  }
  topHeaderBrand1() {
    this.headerBrandColor = "#808000";
    document.documentElement.setAttribute("header-color2", "headerBrand1");
    document
      .getElementsByClassName("headerBrand2")[0]
      ?.removeAttribute("headerBrand2");
    document
      .getElementsByClassName("headerBrand3")[0]
      ?.removeAttribute("headerBrand3");
  }
  topHeaderBrand2() {
    this.headerBrandColor = "#FF6347";
    document.documentElement.setAttribute("header-color2", "headerBrand2");
    document
      .getElementsByClassName("headerBrand1")[0]
      ?.removeAttribute("headerBrand1");
    document
      .getElementsByClassName("headerBrand3")[0]
      ?.removeAttribute("headerBrand3");
  }
  topHeaderBrand3(e) {
    this.headerBrandColor = e;
    document.documentElement.setAttribute("header-color2", "headerBrand3");
    document
      .getElementsByClassName("headerBrand1")[0]
      ?.removeAttribute("headerBrand1");
    document
      .getElementsByClassName("headerBrand2")[0]
      ?.removeAttribute("headerBrand2");
    const bodyStyles = document.getElementsByTagName("html")[0].style;
    bodyStyles.setProperty("--headerbg", e);
  }
  changeHeaderColors1() {
    this.headerColor = "#008000";
    document.documentElement.setAttribute("header-color1", "header1");
    document.getElementsByClassName("header2")[0]?.removeAttribute("header2");
    document.getElementsByClassName("header3")[0]?.removeAttribute("header3");
  }
  changeHeaderColors2() {
    this.headerColor = "#101426";
    document.documentElement.setAttribute("header-color1", "header2");
    document.getElementsByClassName("header1")[0]?.removeAttribute("header1");
    document.getElementsByClassName("header3")[0]?.removeAttribute("header3");
  }
  changeHeaderColors3(e) {
    this.headerColor = e;
    document.documentElement.setAttribute("header-color1", "header3");
    document.getElementsByClassName("header1")[0]?.removeAttribute("header1");
    document.getElementsByClassName("header2")[0]?.removeAttribute("header2");
    const bodyStyles = document.getElementsByTagName("html")[0].style;
    bodyStyles.setProperty("--headersidebg", e);
  }
  StoreColorCode() {
    const obj = {
      sideBarColor: this.sidebarColor,
      headerBrandColor: this.headerBrandColor,
      headerColor: this.headerColor,
      AccountType: this.dropValdata,
    }; // store dropDown office name here
    if (
      this.sidebarColor === "" ||
      this.sidebarColor === undefined ||
      this.headerColor === "" ||
      this.headerColor === undefined ||
      this.headerBrandColor === "" ||
      this.headerBrandColor === undefined ||
      !this.dropValdata
    ) {
      this.toster.warning("Please select values");
      return;
    }
    const alreadyExist = this.officeData.filter(
      (res) => res.AccountType === this.dropValdata
    );
    if (
      this.dropValdata === "" ||
      this.dropValdata === undefined ||
      !alreadyExist.length
    ) {
      this.userService.SendColorDetails(obj).subscribe(() => {
        this.toster.success("insert successfully");
      });
    } else if (
      this.dropValdata != null ||
      this.dropValdata != "" ||
      alreadyExist.length
    ) {
      this.userService
        .updateColorCode(this.gettingAccountOffice, obj)
        .subscribe((data) => {
          this.toster.success("update successfully");
        });
    }
  }

  sideMenu() {
    this.data = window.location.hash.split("/")[1];
    this.showedSubMenu(this.data);
  }

  sessionTimeout() {
    //   Session Time Out
    this.sessionTimeOutVal = setTimeout(() => {
      this.logout();
    }, 8000000); //  Milli Second
  }
  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }
  MainSearchBar(MainsearchTag) {
    this.userService.PostMainSearch(MainsearchTag.value).subscribe((res) => {
      this.GetVideo = res.videosResult;
      this.userService.MainsearchTag.next(this.GetVideo);

      this.GetDocument = res.documentsResult;
      const searchResults = {

        documents: this.GetDocument,
        videos: this.GetVideo

      }
      this.userService.DocumentServiceTag.next(searchResults);
    });
    this.userService.MainsearchTag.next(MainsearchTag.value);
    if (MainsearchTag.value === "") {
      this.router.navigate(["/home"]);
    } else {
      this.router.navigate(["/mainSearchBar"]);
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }
  showedSubMenu(type) {
    if (type === "account") {
      this.showCalendarSub = false;
      this.showLeadSub = false;
      this.showLeadSub = false;
      this.showWebsiteSub = false;
      this.showPromoSub = false;
      this.showAccountSub = !this.showAccountSub;
    } else if (type === "calendar") {
      this.showAccountSub = false;
      this.showEmailSub = false;
      this.showLeadSub = false;
      this.showLeadSub = false;
      this.showWebsiteSub = false;
      this.showPromoSub = false;
      this.showCalendarSub = !this.showCalendarSub;
    } else if (type === "email") {
      this.showAccountSub = false;
      this.showCalendarSub = false;
      this.showLeadSub = false;
      this.showLeadSub = false;
      this.showWebsiteSub = false;
      this.showPromoSub = false;
      this.showEmailSub = !this.showEmailSub;
    } else if (type === "uniqueoffers") {
      this.showAccountSub = false;
      this.showCalendarSub = false;
      this.showEmailSub = false;
      // this.showLeadSub = false;
      this.showWebsiteSub = false;
      this.showPromoSub = false;
      this.showLeadSub = !this.showLeadSub;
    } else if (type === "socialpromo") {
      this.showAccountSub = false;
      this.showCalendarSub = false;
      this.showCalendarSub = false;
      this.showEmailSub = false;
      this.showLeadSub = false;
      this.showWebsiteSub = false;
      this.showPromoSub = !this.showPromoSub;
    } else if (type === "website") {
      this.showAccountSub = false;
      this.showCalendarSub = false;
      this.showCalendarSub = false;
      this.showEmailSub = false;
      this.showLeadSub = false;
      this.showPromoSub = false;
      this.showWebsiteSub = !this.showWebsiteSub;
    } else if (type === "content") {
      this.showAccountSub = false;
      this.showCalendarSub = false;
      this.showCalendarSub = false;
      this.showEmailSub = false;
      this.showLeadSub = false;
      this.showPromoSub = false;
      this.showWebsiteSub = false;
      this.showContentSub = !this.showContentSub;
    }
  }

  logout() {
    this.showCalendarSub = false;
    this.showEmailSub = false;
    this.showLeadSub = false;
    this.showLeadSub = false;
    this.showWebsiteSub = false;
    this.showPromoSub = false;
    this.showAccountSub = false;
    const superadmin_id = localStorage.getItem("superadmin_id");
    if (superadmin_id === null) {
      this.authenticationService.logout();
      this.router.navigate(['/register'])
    } else {
      this.userService
        .getRequestGetUserById("/User/getUserById", superadmin_id)
        .pipe(first())
        .subscribe((userDetails) => {
          const user: any = {
            id: userDetails?.id,
            username: "",
            firstName: userDetails?.first_name,
            lastName: userDetails?.last_name,
            phoneNo: userDetails?.phone_number,
            email: userDetails?.email,
            role: userDetails?.roles,
            marketId: userDetails?.market_id,
            companyId: userDetails?.company_id,
            parentId: userDetails?.parent_id,
            profileImage:
              userDetails?.user_personalphoto != "" &&
                userDetails?.user_personalphoto != null
                ? userDetails?.user_personalphoto
                : "../assets/images/user2-160x160.jpg",
            personalContent: userDetails?.user_personalcontents,
            userLevel:
              userDetails?.user_level != null ? userDetails?.user_level : "A",
          };
          this.userDetails = userDetails;
          localStorage.clear();
          localStorage.setItem("currentUser", JSON.stringify(user));
          this.authenticationService.currentUserSubject.next(user);
          this.first_name = this.currentUser.firstName;
          this.last_name = this.currentUser.lastName;
          this.router.navigate(["/supervisor/users"]);
        });
    }
  }

  closeToggel() {
    this.openToggel = true;
  }

  getLogo() {
    this.userService.getOfficeData().subscribe((res) => {
      const data = res.getOffice;
      this.curOffice = data.filter((x) => x.Name === this.officeName)[0];

      if (this.curOffice?.OfficeLogo) {
        this.userService
          .getFiles(this.curOffice.OfficeLogo)
          .subscribe((blob) => {
            if (blob.msg === "Fail") {
              this.curOffice.thumbnail =
                "../../../assets/images/office_manager_logo.png";
              return;
            }
            const objectUrl = URL.createObjectURL(new Blob([blob]));
            this.curOffice.thumbnail =
              this.sanitizer.bypassSecurityTrustUrl(objectUrl);
          });
      }

      this.example1 = res.getOffice;
      if (this.example1 && this.example1.length) {
        this.example1.forEach((element, index) => {
          this.userService.getFiles(element.OfficeLogo).subscribe((blob) => {
            if (blob.msg === "Fail") {
              element.thumbnail =
                "../../../assets/images/office_manager_logo.png";
              return;
            }
            const objectUrl = URL.createObjectURL(new Blob([blob]));
            element.thumbnail =
              this.sanitizer.bypassSecurityTrustUrl(objectUrl);
          });
        });
      }
    });
  }

  memberSelect() {
    const user: UserDetails = this.userService.userDetails
    if (isOfficeMember(user) || isAdmin(user)) {
      this.router.navigate(["/training/MemberOffice"]);
    } else {
      this.router.navigate(["/training/ManageAccount"]);
    }
  }

  memberSelectMarketing() {
    const user: UserDetails = this.userService.userDetails
    if (isOfficeMember(user) || isAdmin(user)) {
      this.router.navigate(["/marketing/MemberOffice"]);
    } else {
      this.router.navigate(["/marketing/ManageAccount"]);
    }
  }

  toggleSidebar(value?: boolean) {
    if (value) {
      this.isNavOpen = value;
    } else {
      this.isNavOpen = !this.isNavOpen;
    }
  }

  openNav() {
    this.sideBar.openNav()
  }

  closeNav() {
    this.sideBar.closeNav()
  }
}
