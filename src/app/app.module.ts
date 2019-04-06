import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import {
  AddCheckoutRequestDialogComponent,
 } from './components/item-checkout/add-checkout-request-dialog/add-checkout-request-dialog.component';
import { ReturnCheckoutSheetComponent } from './components/item-checkout/return-checkout-sheet.component';
import { LoginComponent } from './components/login/login.component';
import { AppRoutingModule } from './helpers/app-routing.module';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UserViewComponent } from './components/user-view/user-view.component';
import { CustomMaterialModule } from './helpers/custom.materials';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { LiveUpdateComponent } from './components/live-update/live-update.component';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { EmailListService } from './services/email-list/email-list.service';
import { HttpAdminService } from './services/http-admin/http-admin.service';
import { ManageEventsComponent } from './components/manage-events/manage-events.component';
import {
  ManageLocationsComponent,
} from './components/manage-locations/manage-locations.component';
import { ExtraCreditClassesComponent } from './components/extra-credit-classes/extra-credit-classes.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { VisComponent } from './components/vis/vis.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AddEventDialogComponent } from './components/manage-events/add-event-dialog/add-event-dialog';
import { UpdateEventDialogComponent } from './components/manage-events/update-event-dialog/update-event-dialog';
import { AddUserClassDialogComponent } from './components/extra-credit-classes/add-user-class-dialog/add-user-class-dialog';
import { AddLocationDialogComponent } from './components/manage-locations/add-location-dialog/add-location-dialog';
import { UpdateLocationDialogComponent } from './components/manage-locations/update-location-dialog/update-location-dialog';
import { RemoveLocationDialogComponent } from './components/manage-locations/remove-location-dialog/remove-location-dialog';
import { AddEmailDialogComponent } from './components/send-email/add-email-dialog';
import { ViewEventAttendanceDialogComponent } from './components/event-stats/view-event-attendance/view-event-attendance';
import { HackerDataComponent } from './components/hacker-data/hacker-data.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ViewHackerDataDialogComponent } from './components/hacker-data/view-hacker-data-dialog/view-hacker-data-dialog';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { AuthService, CustomErrorHandlerService } from './services/services';
import { AlertModule } from 'ngx-alerts';
import { NgProgressModule } from '@ngx-progressbar/core';
import { UserResolver } from './helpers/resolvers/UserResolver/user.resolver';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { ItemCheckoutComponent } from './components/item-checkout/item-checkout.component';
import { EventStatsComponent } from './components/event-stats/event-stats.component';
import { ManageHackathonComponent } from './components/manage-hackathon/manage-hackathon.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidebarComponent,
    UserViewComponent,
    ManageUsersComponent,
    LiveUpdateComponent,
    SendEmailComponent,
    AddEmailDialogComponent,
    AddEventDialogComponent,
    UpdateEventDialogComponent,
    ManageEventsComponent,
    ManageLocationsComponent,
    AddLocationDialogComponent,
    UpdateLocationDialogComponent,
    RemoveLocationDialogComponent,
    ExtraCreditClassesComponent,
    AddUserClassDialogComponent,
    AddCheckoutRequestDialogComponent,
    ViewEventAttendanceDialogComponent,
    VisComponent,
    ReturnCheckoutSheetComponent,
    HackerDataComponent,
    DashboardComponent,
    ViewHackerDataDialogComponent,
    StatisticsComponent,
    ItemCheckoutComponent,
    EventStatsComponent,
    ManageHackathonComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    CustomMaterialModule,
    NgxChartsModule,
    AlertModule.forRoot({ maxMessages: 5, timeout: 5000 }),
    NgProgressModule.forRoot(),
    NgProgressHttpModule,
  ],
  entryComponents: [
    AddEmailDialogComponent, AddUserClassDialogComponent, AddEventDialogComponent,
    AddLocationDialogComponent, UpdateLocationDialogComponent, RemoveLocationDialogComponent,
    ViewHackerDataDialogComponent, ViewEventAttendanceDialogComponent,
    AddCheckoutRequestDialogComponent, ReturnCheckoutSheetComponent,
    UpdateEventDialogComponent,
  ],
  providers: [
    EmailListService, HttpAdminService, AngularFireAuth, AuthService,
    CustomErrorHandlerService, UserResolver,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
