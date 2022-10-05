import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { CalendarModule, DateAdapter } from "angular-calendar";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { LayoutModule } from "@angular/cdk/layout";
import { IconsModule } from "angular-bootstrap-md";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { EditAgentComponent } from "./edit-agent/edit-agent.component";
import { EditAgentFormComponent } from "./edit-agent/edit-agent-form/edit-agent-form.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { TextMaskModule } from 'angular2-text-mask';
import { ClipboardModule } from "@angular/cdk/clipboard";
import { AppComponent } from "./app.component";
import { routing } from "./app.routing";
import { AlertComponent } from "./_directives";
import { JwtInterceptor} from "./_helpers";
import { LoginComponent } from "./login";
import { RegisterComponent } from "./register";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { UsersComponent } from "./users/users.component";

import { MatDialogModule } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule } from "@angular/material/core";
import { MatTabsModule } from "@angular/material/tabs";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatTableModule } from "@angular/material/table";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { ColorPickerModule } from "ngx-color-picker";
import { FONT_PICKER_CONFIG } from "ngx-font-picker";
import { FontPickerConfigInterface } from "ngx-font-picker";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatChipsModule } from "@angular/material/chips";
import { ToastrModule } from "ngx-toastr";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { NgxEditorModule } from "ngx-editor";
import {
  FacebookLoginProvider,
  SocialLoginModule,
  SocialAuthServiceConfig,
} from "angularx-social-login";
import { environment } from "../environments/environment";
import { MatBadgeModule } from "@angular/material/badge";
import { ImageCropperModule } from "ngx-image-cropper";
import { NgxLoadingModule } from "ngx-loading";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgxPaginationModule } from "ngx-pagination";
import { MatTooltipModule } from "@angular/material/tooltip";
// For MDB Angular Free
import { ChartsModule, WavesModule } from "angular-bootstrap-md";
import { ForgotPasswordComponent } from "./users/forgot-password/forgot-password.component";
import { UserAuthComponent } from "./user-auth/user-auth.component";
import { ProfileHeaderComponent } from "./profile-header/profile-header.component";
import { ProfileModule } from "./profile/profile.module";
import { LeadModule } from "./lead-information/lead.module";
import { InputLeadsComponent } from "./input-leads/input-leads.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { InviteAgentModule } from "./invite-agents/invite-agent.module";
import { MasterAdminModule } from "./MasterAdmin/master-admin.module";
import { AvailableDocumentsModule } from "./available-documents/available-documents.module";
import { TeaminformationModule } from "./teamInformation/teaminformation.module";
import { MarketingModule } from "./marketing/marketing.module";
import { InputDirective } from "./input-leads/input.directive";
import { ProgressComponent } from "./input-leads/progress/progress.component";
import { TrainingModule } from "./training/training.module";
import { DynamicTemplateComponent } from './dynamic-template/dynamic-template.component';
import { DynamicTemplateDashboardComponent } from "./dynamic-templatef/dynamic-template.component";
import { CardTypeDetectorDirective } from "./card-type-detector.directive";
import { MainSearchBarComponent } from './main-search-bar/main-search-bar.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { WINDOW_PROVIDERS } from './window.providers';
import { SignUpComponent } from "./register/signup/signup.component";
import { SignUpZohoComponent } from "./register/signup-zoho/signup-zoho.component";
import { SideBarComponent } from "./sidebar/sidebar.component";
import { PaymentModule } from "./paments/payments.module";
import ResetPasswordComponent from "./login/reset-password/reset-password.component";
const DEFAULT_FONT_PICKER_CONFIG: FontPickerConfigInterface = {
  // Change this to your Google API key
  apiKey: "AIzaSyA9S7DY0khhn9JYcfyRWb1F6Rd2rwtF_mA",
};

@NgModule({
  imports: [
    PaymentModule,
    NgxPaginationModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    routing,
    BrowserAnimationsModule,
    ToastrModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    IconsModule,
    FormsModule,
    MatExpansionModule,
    DragDropModule,
    MatDialogModule,
    MatBadgeModule,
    MatMenuModule,
    MatIconModule,
    MatTabsModule,
    TeaminformationModule,
    TrainingModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSelectModule,
    MatRadioModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTableModule,
    MatSlideToggleModule,
    MatCardModule,
    MatChipsModule,
    MatAutocompleteModule,
    MasterAdminModule,
    MarketingModule,
    AvailableDocumentsModule,
    ColorPickerModule,
    InviteAgentModule,
    NgxSpinnerModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatPaginatorModule,
    MatSortModule,
    ClipboardModule,
    ChartsModule,
    WavesModule,
    NgxEditorModule,
    ToastrModule.forRoot(), // ToastrModule added
    SocialLoginModule,
    ImageCropperModule,
    NgxLoadingModule.forRoot({}),
    NgSelectModule,
    MatTooltipModule,
    ProfileModule,
    LeadModule,
    TextMaskModule
  ],
  declarations: [
    AppComponent,
    SideBarComponent,
    AlertComponent,
    LoginComponent,
    ResetPasswordComponent,
    RegisterComponent,
    SignUpComponent,
    SignUpZohoComponent,
    UsersComponent,
    CardTypeDetectorDirective,
    ForgotPasswordComponent,
    UserAuthComponent,
    ProfileHeaderComponent,
    InputLeadsComponent,

    DashboardComponent,
    EditAgentComponent,
    EditAgentFormComponent,
    InputDirective,
    DynamicTemplateDashboardComponent,
    ProgressComponent,
    DynamicTemplateComponent,
    MainSearchBarComponent,

    ManageAccountComponent,
  ],
  providers: [
    WINDOW_PROVIDERS,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: FONT_PICKER_CONFIG,
      useValue: DEFAULT_FONT_PICKER_CONFIG,
    },
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(environment.fbAppId),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule { }
