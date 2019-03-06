import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemCheckoutComponent } from '../components/item-checkout/item-checkout.component';
import { LoginComponent } from '../components/login/login.component';
import { RegistrationTableComponent } from '../components/registration-table/registration-table.component';
import { ManageUsersComponent } from '../components/manage-users/manage-users.component';
import { AuthGuard } from './AuthGuard';
import { PreRegistrationTableComponent } from '../components/pre-registration-table/pre-registration-table.component';
import { HttpAdminService } from '../services/http-admin/http-admin.service';
import { LiveUpdateComponent } from '../components/live-update/live-update.component';
import { SendEmailComponent } from '../components/send-email/send-email.component';
import { ManageRsvpComponent } from '../components/manage-rsvp/manage-rsvp.component';
import { ManageLocationsComponent } from '../components/manage-locations/manage-locations.component';
import { ExtraCreditClassesComponent } from '../components/extra-credit-classes/extra-credit-classes.component';
import { ManageEventsComponent } from '../components/manage-events/manage-events.component';
import { VisComponent } from '../components/vis/vis.component';
import { HackerDataComponent } from '../components/hacker-data/hacker-data.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { ManageAdminComponent } from '../components/manage-admin/manage-admin.component';
import { StatisticsComponent } from '../components/statistics/statistics.component';
import { UserResolver } from './resolvers/UserResolver/user.resolver';
import { EventStatsComponent } from '../components/event-stats/event-stats.component';
import { PRIVILEGE_LEVEL } from '../models/privilege-model';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { privilegeLevel: PRIVILEGE_LEVEL.VOLUNTEER },
    resolve: { UserResolver },
  },
  {
    path: 'hackerdata',
    component: HackerDataComponent,
    canActivate: [AuthGuard],
    data: { privilegeLevel: PRIVILEGE_LEVEL.TEAM_MEMBER },
    resolve: { UserResolver },
  },
  {
    path: 'admin',
    component: ManageAdminComponent,
    canActivate: [AuthGuard],
    data: { privilegeLevel: PRIVILEGE_LEVEL.TECHNOLOGY_ADMIN },
    resolve: { UserResolver },
  },
  {
    path: 'checkout',
    component: ItemCheckoutComponent,
    canActivate: [AuthGuard],
    data: { privilegeLevel: PRIVILEGE_LEVEL.TEAM_MEMBER },
    resolve: { UserResolver },
  },
  {
    path: 'stats',
    component: StatisticsComponent,
    canActivate: [AuthGuard],
    data: { privilegeLevel: PRIVILEGE_LEVEL.VOLUNTEER },
    resolve: { UserResolver },
  },
  {
    path: 'preregistrations',
    component: PreRegistrationTableComponent,
    canActivate: [AuthGuard],
    data: { privilegeLevel: PRIVILEGE_LEVEL.VOLUNTEER },
    resolve: { UserResolver },
  },
  {
    path: 'live',
    component: LiveUpdateComponent,
    canActivate: [AuthGuard],
    data: { privilegeLevel: PRIVILEGE_LEVEL.VOLUNTEER },
    resolve: { UserResolver },
  },
  {
    path: 'registrations',
    component: RegistrationTableComponent,
    canActivate: [AuthGuard],
    data: { privilegeLevel: PRIVILEGE_LEVEL.TEAM_MEMBER },
    resolve: { UserResolver },
  },
  {
    path: 'users',
    component: ManageUsersComponent,
    canActivate: [AuthGuard],
    data: { privilegeLevel: PRIVILEGE_LEVEL.VOLUNTEER },
    resolve: { UserResolver },
  },
  {
    path: 'email',
    component: SendEmailComponent,
    data: { privilegeLevel: PRIVILEGE_LEVEL.DIRECTOR },
    resolve: { UserResolver },
  },
  {
    path: 'rsvp',
    component: ManageRsvpComponent,
    canActivate: [AuthGuard],
    data: { privilegeLevel: PRIVILEGE_LEVEL.DIRECTOR },
    resolve: { UserResolver },
  },
  {
    path: 'classes',
    component: ExtraCreditClassesComponent,
    canActivate: [AuthGuard],
    data: { privilegeLevel: PRIVILEGE_LEVEL.TEAM_MEMBER },
    resolve: { UserResolver },
  },
  {
    path: 'events',
    component: ManageEventsComponent,
    canActivate: [AuthGuard],
    data: { privilegeLevel: PRIVILEGE_LEVEL.DIRECTOR },
    resolve: { UserResolver },
  },
  {
    path: 'locations',
    component: ManageLocationsComponent,
    canActivate: [AuthGuard],
    data: { privilegeLevel: PRIVILEGE_LEVEL.DIRECTOR },
    resolve: { UserResolver },
  },
  {
    path: 'vis',
    component: VisComponent,
    canActivate: [AuthGuard],
    data: { privilegeLevel: PRIVILEGE_LEVEL.DIRECTOR },
    resolve: { UserResolver },
  },
  {
    path: 'eventstats',
    component: EventStatsComponent,
    canActivate: [AuthGuard],
    data: { privilegeLevel: PRIVILEGE_LEVEL.TEAM_MEMBER },
    resolve: { UserResolver },
  },
  { path: '**', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), RouterModule],
  exports: [RouterModule],
  providers: [
    AuthGuard,
    HttpAdminService,
  ],
  declarations: [],
})

export class AppRoutingModule {
}
