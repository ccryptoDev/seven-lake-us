import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LandinPageService } from '../_services/landingpage.service';
import { UserService } from '../_services/user.service';
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle,
} from 'chart.js';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LandingPage } from '../types/landingPage.type';
import { LandingTemplate } from '../types/landingTemplate.type';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  landingPages: LandingPage[] = []
  currentPage: LandingPage
  landingTemplates: LandingTemplate[] = []

  showDomainSelect = false

  leadGraphData: any[] = [];
  MatchingURl: any[] = [];
  AllUsers: any;
  getAgentLength: any;
  allAgents: any;
  perValue: any;
  allZohoValues: any;
  perAgentValue: any;
  imageArray = [];
  userName = '';
  currentMonthTeam: any;
  currentMonthLead: any;
  myAllInviteAgnet: any;
  AgentPerValue: any;
  myTotalLead: any;
  leadPerValue: number;
  allAgentPerValue: number;
  perLeadValue: number;
  memberNumber: number;
  isShowModel = false;
  getImageById = [];
  ddDetails = ['Yearly', 'Lifetime', 'Monthly'];
  selectedDetails = 'Yearly';
  isGeneral = true;
  isFunding = false;
  isCommission = false;
  generalData = null;
  fundingData = [];
  CreditLineFunding = null;
  Equipment_Funding = null;
  Retirement_Funding = null;
  Revenue_Advance_Funding = null;
  Term_Loan_Funding = null;
  Other_Funding = null;
  commissionData = [];
  generalCount = 0;
  fundingCount = 0;
  commissionCount = 0;
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'september',
    'October',
    'November',
    'December',
  ];

  domains = [
    { value: "24hourapprovals.com/", name: "24hourapprovals.com" },
    { value: "apply4funding.com/", name: "apply4funding.com" },
    { value: "ezloanfunding.com/", name: "ezloanfunding.com" },
    { value: "financeneeds.com/", name: "financeneeds.com" },
    { value: "fundabilitytest.com/", name: "fundabilitytest.com" },
    { value: "getmecapital.com/", name: "getmecapital.com" },
    { value: "ifundbiz.com/", name: "ifundbiz.com" },
    { value: "mvpfunding.com/", name: "mvpfunding.com" },
  ]

  @ViewChild('confirmationPopup') confirmationPopup: TemplateRef<any>;
  @ViewChild('select') select: ElementRef;

  private confirmationPopupRef: MatDialogRef<TemplateRef<any>>;
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private landingService: LandinPageService,
    public router: Router,
    public dialog: MatDialog
  ) {
    Chart.register(
      ArcElement,
      LineElement,
      BarElement,
      PointElement,
      BarController,
      BubbleController,
      DoughnutController,
      LineController,
      PieController,
      PolarAreaController,
      RadarController,
      ScatterController,
      CategoryScale,
      LinearScale,
      LogarithmicScale,
      RadialLinearScale,
      TimeScale,
      TimeSeriesScale,
      Decimation,
      Filler,
      Legend,
      Title,
      Tooltip,
      SubTitle
    );
  }

  get domainSelected() {
    return this.userService?.userDetails?.Domain_Selected || false
  }

  get marketingDomain() {
    const website = this.userService?.userDetails?.Website
    if (website) {
      return website.split('/')[0] + '/'
    }
    return 'financeneeds.com/'
  }

  ngOnInit(): void {
    const userDetails = this.userService.userDetails
    const userWebsite = userDetails.Website

    this.GetGernalData('tab');

    this.memberNumber = this.userService.userDetails?.Member_Number;
    this.userName = JSON.parse(localStorage.getItem('currentUser'));
    if (!this.userService.userDetails) {
      this.userService.getAgentsByEmail().subscribe((result) => {
        if (result.agent && result.agent.length > 0) {
          this.userService.userDetails = result.agent[0];
          const ind = result.agent.findIndex(
            (x) => x.Agent_First !== null && x.Agent_First !== 'undefined '
          );
          if (this.userService.userDetails) {
            this.userService.userDetails.Agent_First =
              result.agent[ind].Agent_First;
            this.userService.userDetails.Agent_Last =
              result.agent[ind].Agent_Last;
          }
        }
        const userData = this.userService.userDetails;
        this.getLeadInformation();
        this.getInviteAgentData();
        this.getAgentInformation();
        this.getAllAgents();
        this.getAllZohoLeads();
        this.getLandingPageDetails();
        this.getLandingTemplateDetails();
        this.GetGernalData('load');

        localStorage.setItem('UserDetails', JSON.stringify(userData));
      });
    } else {
      this.landingService
        .getLandingPages(this.userName)
        .subscribe((data: LandingPage[]) => {
          this.landingPages = data
          this.getLeadInformation();
          this.getAgentInformation();
          this.getAllZohoLeads();
          this.getAllAgents();
          this.getInviteAgentData();
          this.getLandingTemplateDetails();
        });
    }
  }

  getLandingPageDetails() {
    return this.landingService
      .getLandingPages(this.userName)
      .subscribe((data: LandingPage[]) => {
        this.landingPages = data
      });
  }

  getLandingTemplateDetails() {
    this.landingService
      .getLandingTemplates()
      .subscribe((data) => {
        this.landingTemplates = data
      });
  }
  imageExists(url) {
    const img = new Image();
    img.onload = function () {
      return true;
    };
    img.onerror = function () {
      return false;
    };
    img.src = url;
    return img.onload;
  }

  getInviteAgentData() {
    this.userService.getInviteAgentsData().subscribe((data) => {
      this.myAllInviteAgnet = data.team.length;
      const curDate = new Date().getMonth() + 1;
      const monthDataTeam = data.team.filter(
        (x) => x.Created_Time.slice(6, 7) === curDate
      );
      this.currentMonthTeam = monthDataTeam.length;
      this.AgentPerValue =
        (this.currentMonthTeam * 100) / this.myAllInviteAgnet + '%';
    });
  }
  getAgentInformation() {
    this.userService.getallAgents().subscribe((res) => {
      this.AllUsers = res.agents?.length || 1;
      setTimeout(() => {
        this.allAgentPerValue = (this.myAllInviteAgnet * 100) / this.AllUsers;
      }, 100);
    });
  }

  getLeadInformation() {
    this.userService.getLeadInfo().subscribe((data) => {

      this.myTotalLead = data.lead.length;
      if (this.myTotalLead > 0) {
        this.fundingData = data.lead
          .filter(
            (y) =>
              y.CRE_Funding &&
              y.Credit_Line_Funding &&
              y.Other_Funding &&
              y.Equipment_Funding &&
              y.Retirement_Funding &&
              y.Revenue_Advance_Funding &&
              y.Term_Loan_Funding !== null
          )
          .map((z) => ({
            Funding:
              z.CRE_Funding +
              z.Credit_Line_Funding +
              z.Other_Funding +
              z.Equipment_Funding +
              z.Retirement_Funding +
              z.Revenue_Advance_Funding +
              z.Term_Loan_Funding,
            CreatedTime: z.Created_Time,
          }));

        this.commissionData = data.lead
          .filter(
            (y) =>
              y.CRE_Commission &&
              y.Agent_CRE_Commission &&
              y.Agent_Credit_Line_Commission &&
              y.Agent_Equipment_Commission &&
              y.Agent_Other_Commission &&
              y.Agent_Revenue_Commission &&
              y.Agent_Term_Loan_Commission &&
              y.Credit_Line_Commission &&
              y.Equipment_Commission &&
              y.Other_Commission &&
              y.Retirement_Commission &&
              y.Revenue_Advance_Commission &&
              y.Term_Loan_Commission &&
              y.Sponsor_CRE_Commission &&
              y.Sponsor_Credit_Line_Commission &&
              y.Sponsor_Equipment_Commmission &&
              y.Sponsor_Other_Commission &&
              y.Sponsor_Revenue_Commission &&
              y.Sponsor_Term_Loan_Commission !== null
          )
          .map((z) => {
            if (
              typeof z.Sponsor_Term_Loan_Commission &&
              z.Agent_Equipment_Commission &&
              z.Agent_Other_Commission &&
              z.Agent_Other_Commission &&
              z.Agent_Revenue_Commission &&
              z.Sponsor_CRE_Commission &&
              z.Sponsor_Credit_Line_Commission &&
              z.Sponsor_Equipment_Commmission &&
              z.Sponsor_Other_Commission &&
              z.Sponsor_Revenue_Commission &&
              z.Sponsor_Term_Loan_Commission === 'string'
            ) {
              // convert to int
              z.Sponsor_Term_Loan_Commission = parseInt(
                z.Sponsor_Term_Loan_Commission,
                10
              );
              z.Agent_Equipment_Commission = parseInt(
                z.Agent_Equipment_Commission,
                10
              );
              z.Agent_Other_Commission = parseInt(z.Agent_Other_Commission, 10);
              z.Agent_Revenue_Commission = parseInt(
                z.Agent_Term_Loan_Commission,
                10
              );
              z.Sponsor_CRE_Commission = parseInt(z.Sponsor_CRE_Commission, 10);
              z.Sponsor_Credit_Line_Commission = parseInt(
                z.Sponsor_Credit_Line_Commission,
                10
              );
              z.Sponsor_Equipment_Commmission = parseInt(
                z.Sponsor_Equipment_Commmission,
                10
              );
              z.Sponsor_Other_Commission = parseInt(
                z.Sponsor_Other_Commission,
                10
              );
              z.Sponsor_Revenue_Commission = parseInt(
                z.Sponsor_Revenue_Commission,
                10
              );
              z.Sponsor_Term_Loan_Commission = parseInt(
                z.Sponsor_Term_Loan_Commission,
                10
              );
            }
            return {
              Commission:
                z.CRE_Commission +
                z.Agent_CRE_Commission +
                z.Agent_Credit_Line_Commission +
                parseInt(z.Agent_Equipment_Commission, 10) +
                parseInt(z.Agent_Other_Commission, 10) +
                parseInt(z.Sponsor_Term_Loan_Commission, 10) +
                parseInt(z.Agent_Term_Loan_Commission, 10) +
                z.Credit_Line_Commission
                + z.Other_Commission +
                z.Retirement_Commission
                + z.Revenue_Advance_Commission +
                z.Term_Loan_Commission
                + parseInt(z.Sponsor_CRE_Commission, 10) +
                parseInt(z.Sponsor_Credit_Line_Commission, 10) +
                parseInt(z.Sponsor_Equipment_Commmission, 10) +
                parseInt(z.Sponsor_Other_Commission, 10) +
                parseInt(z.Sponsor_Revenue_Commission, 10) +
                +parseInt(
                  z.Agent_Revenue_Commission,
                  10
                )
                + z.Equipment_Commission,
              CreatedTime: z.Created_Time,
            };
          });
        this.fundingCount = this.fundingData.length;
        this.commissionCount = this.commissionData.length;
      }

      const curDate = new Date().getMonth() + 1;
      const monthDataLead = data.lead.filter(
        (x) => x.Created_Time.slice(6, 7) === curDate
      );
      this.currentMonthLead = monthDataLead.length;

      const January = data.lead.filter(
        (x) => x.Created_Time.slice(6, 7) === 1
      ).length;
      const February = data.lead.filter(
        (x) => x.Created_Time.slice(6, 7) === 2
      ).length;
      const March = data.lead.filter(
        (x) => x.Created_Time.slice(6, 7) === 3
      ).length;
      const April = data.lead.filter(
        (x) => x.Created_Time.slice(6, 7) === 4
      ).length;
      const May = data.lead.filter((x) => x.Created_Time.slice(6, 7) === 5).length;
      const June = data.lead.filter(
        (x) => x.Created_Time.slice(6, 7) === 6
      ).length;

      this.leadGraphData.push(January, February, March, April, May, June);

      this.GetGernalData('load');
    });
  }

  GetGeneralGraph(data, commValue, funValue, opt) {
    let getleadGraph;
    if (opt === 'tab') {
      getleadGraph = Chart.getChart('myChart');
      if (getleadGraph !== undefined) {
        getleadGraph.destroy();
      }
    }
    getleadGraph = new Chart('myChart', {
      type: 'line',
      data: {
        labels: data,
        datasets: [
          {
            label: 'Funding',
            data: funValue,
            borderWidth: 2,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
            yAxisID: 'A',
          },

          {
            label: 'Commission',
            data: commValue,
            borderWidth: 2,
            backgroundColor: 'rgb(122, 99, 255)',
            borderColor: 'rgba(102, 99, 255, 0.2)',
            yAxisID: 'B',
          },
        ],
      },
      options: {
        aspectRatio: 2,
        scales: {
          A: {
            beginAtZero: true,
            title: { text: 'Amount Funded', display: true },
            grid: {
              display: false,
              drawOnChartArea: false,
              drawTicks: false,
              borderWidth: 2,
            },
            position: 'left',
            ticks: {
              callback: function (value) {
                return '$' + value;
              },
              stepSize: 5
            },
            min: 0,
            max: 25,
          },
          B: {
            beginAtZero: true,
            title: { text: 'Commission Earned', display: true },
            grid: {
              display: false,
              drawOnChartArea: false,
              drawTicks: false,
              borderWidth: 2,
            },
            ticks: {
              callback: function (value) {
                return '$' + value;
              },
              stepSize: 5
            },
            min: 0,
            max: 25,
            position: 'right',
          },
          x: {
            beginAtZero: true,
            title: { text: 'Months', display: true },
            grid: {
              lineWidth: 0,
            },
          },
        },
      },
    });
    getleadGraph.render();
  }

  getAllAgents() {
    this.userService.AllZohoAgents().subscribe((resp) => {
      this.allAgents = resp.agents.length;
      setTimeout(() => {
        this.allAgentPerValue = (this.myAllInviteAgnet * 100) / this.allAgents;
      }, 100);
    });
  }

  getAllZohoLeads() {
    this.userService.AllZohoLeads().subscribe((leads) => {
      this.allZohoValues = leads.length;
      setTimeout(() => {
        this.perLeadValue = (this.myTotalLead * 100) / this.allZohoValues;
      }, 1000);
    });
  }

  copyMessage(data) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = data;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toastr.success('Text copied to clipboard');
  }

  openconfirmationpopup(page: LandingPage) {
    this.isShowModel = true;
    this.currentPage = page;
  }

  openConfirmation() {
    this.openConfirmationDialog();
  }

  openConfirmationDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.restoreFocus = false;
    dialogConfig.autoFocus = false;
    dialogConfig.role = 'dialog';

    this.confirmationPopupRef = this.dialog.open(
      this.confirmationPopup,
      dialogConfig
    );

    this.confirmationPopupRef.afterClosed();
  }

  closeSelectTemplate() {
    this.confirmationPopupRef.close();
  }

  onSelectTemplate() {
    if (this.landingTemplates.length > 0) {
      const selectedTemplates = this.landingTemplates.filter(
        item => item.templateName === this.currentPage.name
      );
      selectedTemplates.forEach((item) => {
        if ((item.agentName && !item.agentName.includes(this.userName)) || !item.agentName) {
          item.agentName = item.agentName === null
            ? this.userService.userDetails?.Email
            : item.agentName + ',' + this.userService.userDetails?.Email;
          this.landingService.updateLandingTemplate(item);
        }
      });

      const data1 = this.landingTemplates.filter(
        (x) =>
          x.templateName !== this.currentPage.name &&
          x.agentName !== null &&
          x.agentName.includes(this.userService.userDetails?.Email)
      );

      data1.forEach((item) => {
        const itemagents = item.agentName.split(',');
        const index = itemagents.findIndex(
          (y) => y === this.userService.userDetails?.Email
        );
        itemagents.splice(index, 1);
        item.agentName =
          itemagents.toString() === '' ? null : itemagents.toString();
        this.landingService.updateLandingTemplate(item);
      });
      this.closeSelectTemplate();
    }
  }

  updateDomain() {
    const Website = this.select.nativeElement.value + this.memberNumber;


    this.userService.updateWebsite(Website).subscribe((res) => {
      this.userService.userDetails.Website = Website
      this.userService.userDetails['Domain_Selected'] = true
      this.toastr.success('Website updated')
    }, () => {
      this.toastr.error('Failed to update website, please try again')
    });
  }

  ChangeDetails() {
    if (this.isGeneral) {
      this.selectTab(1);
    } else if (this.isFunding) {
      this.selectTab(2);
    } else if (this.isCommission) {
      this.selectTab(3);
    }
  }

  selectTab(tab) {
    if (tab === 1) {
      this.isGeneral = true;
      this.isFunding = false;
      this.isCommission = false;
      this.GetGernalData('tab');
    } else if (tab === 2) {
      this.isGeneral = false;
      this.isFunding = true;
      this.isCommission = false;
      this.fundingGraphDetails();
    } else if (tab === 3) {
      this.isGeneral = false;
      this.isFunding = false;
      this.isCommission = true;
      this.commissionGraphDetails();
    }
  }

  fundingGraphDetails() {
    let funGrapData = [];
    let funGrapVal = [];
    if (this.selectedDetails === 'Yearly') {
      const fundObjAll = this.fundingData.map((x) => ({
        data: x.CreatedTime.split('-')[0],
        value: x.Funding,
      }));
      const fundObj = [];
      fundObjAll.forEach((x) => {
        if (
          fundObj.length === 0 ||
          fundObj.filter((y) => y.fundingData === x.data).length <= 0
        ) {
          const obj = {
            fundingValue: x.value,
            fundingData: x.data,
          };
          fundObj.push(obj);
        } else {
          const index = fundObj.findIndex((y) => y.fundingData === x.data);
          fundObj[index].fundingData = x.data;
          fundObj[index].fundingValue = fundObj[index].fundingValue + x.value;
        }
      });
      funGrapData = fundObj.map((d) => d.fundingData);
      funGrapVal = fundObj.map((v) => v.fundingValue);
    } else if (this.selectedDetails === 'Monthly') {
      const fundObjAll = this.fundingData.map((x) => ({
        data: x.CreatedTime.split('-')[1],
        value: x.Funding,
      }));
      const fundObj = [];
      fundObjAll.forEach((x) => {
        if (
          fundObj.length === 0 ||
          fundObj.filter((y) => y.fundingData === x.data).length <= 0
        ) {
          const obj = {
            fundingValue: x.value,
            fundingData: x.data,
          };
          fundObj.push(obj);
        } else {
          const index = fundObj.findIndex((y) => y.fundingData === x.data);
          fundObj[index].fundingData = x.data;
          fundObj[index].fundingValue = fundObj[index].fundingValue + x.value;
        }
      });
      funGrapData = fundObj.map((d) => this.months[d.fundingData - 1]);
      funGrapVal = fundObj.map((v) => v.fundingValue);
    }

    setTimeout(() => this.fundingGraph(funGrapData, funGrapVal, 'funChart'), 0);
  }
  commissionGraphDetails() {
    let comGrapData = [];
    let comGrapVal = [];
    if (this.selectedDetails === 'Yearly') {
      const comObjAll = this.commissionData.map((x) => ({
        data: x.CreatedTime.split('-')[0],
        value: x.Commission,
      }));
      const comObj = [];
      comObjAll.forEach((x) => {
        if (
          comObj.length === 0 ||
          comObj.filter((y) => y.commissionData === x.data).length <= 0
        ) {
          const obj = {
            commissionValue: x.value,
            commissionData: x.data,
          };
          comObj.push(obj);
        } else {
          const index = comObj.findIndex((y) => y.commissionData === x.data);
          comObj[index].commissionData = x.data;
          comObj[index].commissionValue =
            comObj[index].commissionValue + x.value;
        }
      });
      comGrapData = comObj.map((d) => d.commissionData);
      comGrapVal = comObj.map((v) => v.commissionValue);
    } else if (this.selectedDetails === 'Monthly') {
      const comObjAll = this.commissionData.map((x) => ({
        data: x.CreatedTime.split('-')[1],
        value: x.Commission,
      }));
      const comObj = [];
      comObjAll.forEach((x) => {
        if (
          comObj.length === 0 ||
          comObj.filter((y) => y.commissionData === x.data).length <= 0
        ) {
          const obj = {
            commissionValue: x.value,
            commissionData: x.data,
          };
          comObj.push(obj);
        } else {
          const index = comObj.findIndex((y) => y.commissionData === x.data);
          comObj[index].commissionData = x.data;
          comObj[index].commissionValue =
            comObj[index].commissionValue + x.value;
        }
      });
      comGrapData = comObj.map((d) => this.months[d.commissionData - 1]);
      comGrapVal = comObj.map((v) => v.commissionValue);
    }

    // fundObj.forEach( ele => { ele.fundingData = this.months[ele.fundingData - 1]});
    setTimeout(
      () => this.fundingGraph(comGrapData, comGrapVal, 'commChart'),
      0
    );
  }

  fundingGraph(funGrapData, funGrapVal, chartname) {
    let getleadGraph = Chart.getChart(chartname);
    if (getleadGraph !== undefined) {
      getleadGraph.destroy();
    }
    getleadGraph = new Chart(chartname, {
      type: 'line',
      data: {
        labels: funGrapData,
        datasets: [
          {
            label: chartname === 'funChart' ? 'Funding' : 'Commission',
            data: funGrapVal,
            borderWidth: 1,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: false,
              drawOnChartArea: false,
              drawTicks: false,
              borderWidth: 1,
            },
          },
          x: {
            grid: {
              lineWidth: 0,
            },
          },
        },
      },
    });
  }

  GetGernalData(opt) {
    let funGrapData = [];
    let funGrapVal = [];
    let comGrapData = [];
    let comGrapVal = [];
    if (this.selectedDetails === 'Yearly') {
      const comObjAll = this.commissionData?.map((x) => ({
        data: x.CreatedTime.split('-')[0],
        value: x.Commission,
      })) || [];
      const comObj = [];
      comObjAll.forEach((x) => {
        if (
          comObj.length === 0 ||
          comObj.filter((y) => y.commissionData === x.data).length <= 0
        ) {
          const obj = {
            commissionValue: x.value,
            commissionData: x.data,
          };
          comObj.push(obj);
        } else {
          const index = comObj.findIndex((y) => y.commissionData === x.data);
          comObj[index].commissionData = x.data;
          comObj[index].commissionValue =
            comObj[index].commissionValue + x.value;
        }
      });
      comGrapData = comObj.map((d) => d.commissionData);
      comGrapVal = comObj.map((v) => v.commissionValue);
      const fundObjAll = this.fundingData?.map((x) => ({
        data: x.CreatedTime.split('-')[0],
        value: x.Funding,
      })) || [];
      const fundObj = [];
      fundObjAll.forEach((x) => {
        if (
          fundObj.length === 0 ||
          fundObj.filter((y) => y.fundingData === x.data).length <= 0
        ) {
          const obj = {
            fundingValue: x.value,
            fundingData: x.data,
          };
          fundObj.push(obj);
        } else {
          const index = fundObj.findIndex((y) => y.fundingData === x.data);
          fundObj[index].fundingData = x.data;
          fundObj[index].fundingValue = fundObj[index].fundingValue + x.value;
        }
      });
      funGrapData = fundObj.map((d) => d.fundingData);
      funGrapVal = fundObj.map((v) => v.fundingValue);
    } else if (this.selectedDetails === 'Monthly') {
      const comObjAll = this.commissionData?.map((x) => ({
        data: x.CreatedTime.split('-')[1],
        value: x.Commission,
      })) || [];
      const comObj = [];
      comObjAll.forEach((x) => {
        if (
          comObj.length === 0 ||
          comObj.filter((y) => y.commissionData === x.data).length <= 0
        ) {
          const obj = {
            commissionValue: x.value,
            commissionData: x.data,
          };
          comObj.push(obj);
        } else {
          const index = comObj.findIndex((y) => y.commissionData === x.data);
          comObj[index].commissionData = x.data;
          comObj[index].commissionValue =
            comObj[index].commissionValue + x.value;
        }
      });
      comGrapData = comObj.map((d) => this.months[d.commissionData - 1]);
      comGrapVal = comObj.map((v) => v.commissionValue);
      const fundObjAll = this.fundingData?.map((x) => ({
        data: x.CreatedTime.split('-')[1],
        value: x.Funding,
      })) || [];
      const fundObj = [];
      fundObjAll.forEach((x) => {
        if (
          fundObj.length === 0 ||
          fundObj.filter((y) => y.fundingData === x.data).length <= 0
        ) {
          const obj = {
            fundingValue: x.value,
            fundingData: x.data,
          };
          fundObj.push(obj);
        } else {
          const index = fundObj.findIndex((y) => y.fundingData === x.data);
          fundObj[index].fundingData = x.data;
          fundObj[index].fundingValue = fundObj[index].fundingValue + x.value;
        }
      });
      funGrapData = fundObj.map((d) => this.months[d.fundingData - 1]);
      funGrapVal = fundObj.map((v) => v.fundingValue);
    }
    setTimeout(
      () => this.GetGeneralGraph(comGrapData, comGrapVal, funGrapVal, opt),
      0
    );
  }
}
