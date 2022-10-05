import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';
import { ForgotPasswordComponent } from './users/forgot-password/forgot-password.component';

///////////////////////// for test the ui\\\\\\\\\\\\\\\\\\\\\\\\\\

import { UserAuthComponent } from './user-auth/user-auth.component';
// import { FortestComponent } from './fortest/fortest.component';
import { InputLeadsComponent } from './input-leads/input-leads.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditAgentComponent } from './edit-agent/edit-agent.component';
import { DynamicTemplateComponent } from './dynamic-template/dynamic-template.component';
import { MainSearchBarComponent } from './main-search-bar/main-search-bar.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { AppGuard } from './_guards/app.guard';
import { LoginGuard } from './_guards/login.guard';


const appRoutes: Routes = [
  { path: 'register', component: RegisterComponent, canActivate: [LoginGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  {
    path: '', canActivate: [AppGuard], children: [
      { path: 'changepassword/:id', component: UserAuthComponent },
      { path: 'input-leads', component: InputLeadsComponent, canActivate: [AuthGuard] },
      { path: 'home', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'user/forgotPassword', component: ForgotPasswordComponent },
      { path: 'user/resetPassword/:id', component: ForgotPasswordComponent },
      { path: 'edit-agent', component: EditAgentComponent },
      { path: 'mainSearchBar', component: MainSearchBarComponent },
      { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuard] },
      { path: 'lead', loadChildren: () => import('./lead-information/lead.module').then(m => m.LeadModule), canActivate: [AuthGuard] },
      { path: 'MasterAdmin', loadChildren: () => import('./MasterAdmin/master-admin.module').then(m => m.MasterAdminModule), canActivate: [AuthGuard] },
      { path: 'documents', loadChildren: () => import('./available-documents/available-documents.module').then(m => m.AvailableDocumentsModule), canActivate: [AuthGuard] },
      { path: 'teaminformation', loadChildren: () => import('./teamInformation/teaminformation.module').then(m => m.TeaminformationModule), canActivate: [AuthGuard] },
      { path: 'marketing', loadChildren: () => import('./marketing/marketing.module').then(m => m.MarketingModule), canActivate: [AuthGuard] },
      { path: 'training', loadChildren: () => import('./training/training.module').then(m => m.TrainingModule), canActivate: [AuthGuard] },
      // otherwise redirect to home
      { path: 'manageAccount', component: ManageAccountComponent },
      { path: 'training/ManageAccount', component: ManageAccountComponent },
      { path: 'marketing/ManageAccount', component: ManageAccountComponent },
      { path: ':id', component: DynamicTemplateComponent },
    ]
  }
];

export const routing = RouterModule.forRoot(appRoutes, { useHash: true });
