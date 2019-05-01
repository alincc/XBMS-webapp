import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/auth.guard';
import { FileserverComponent } from './shared/fileserver/fileserver.component';
import { AppComponent } from './app.component';
import { RelationComponent } from './relation/relation.component';
import { MarketingComponent } from './marketing/marketing.component';
import { SettingsComponent } from './settings/settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ReturnpageComponent } from './returnpage/returnpage.component';
import { MarketingplannerComponent } from './marketingplanner/marketingplanner.component'
import { LinkedinComponent } from './shared/linkedin/linkedin.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full', canActivate: [AuthGuard]
  },

  {
    path: 'login', component: LoginComponent
  },

  {
    path: 'dashboard', component: DashboardComponent
    , canActivate: [AuthGuard]
  },

  {
    path: 'relation',
    component: RelationComponent
    , canActivate: [AuthGuard]
  },

  {
    path: 'marketing',
    component: MarketingComponent
    , canActivate: [AuthGuard]
  },

  {
    path: 'marketing/:id',
    component: MarketingComponent
    , canActivate: [AuthGuard]
  },

  {
    path: 'settings', component: SettingsComponent
    , canActivate: [AuthGuard]
  },

  {
    path: 'settings/:code/:state', component: SettingsComponent
    , canActivate: [AuthGuard]
  },

  {
    path: 'filemanager/:id', component: FileserverComponent
    , canActivate: [AuthGuard]
  },

  {
    path: 'linkedin', component: LinkedinComponent
    , canActivate: [AuthGuard]
  },

  {
    path: 'marketingplanner', component: MarketingplannerComponent
    , canActivate: [AuthGuard]
  },

  {
    path: 'returnpage', component: ReturnpageComponent
    , canActivate: [AuthGuard]
  },

  {
    path: '**', component: DashboardComponent
    , canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routedComponents = [DashboardComponent];
