import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AppRoutingModule } from './helpers/app-routing.module';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UserViewComponent } from './components/user-view/user-view.component';
import { CustomMaterialModule } from './helpers/custom.materials'
import { RegistrationTableComponent } from './components/registration-table/registration-table.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { PreRegistrationTableComponent } from './components/pre-registration-table/pre-registration-table.component';
import { LiveUpdateComponent } from './components/live-update/live-update.component';
import { SendEmailComponent } from './components/send-email/send-email.component';
import { EmailListService } from './services/email-list/email-list.service';
import { HttpAdminService } from './services/http-admin/http-admin.service';
import { ManageEventsComponent } from './components/manage-events/manage-events.component';
import { ManageRsvpComponent } from './components/manage-rsvp/manage-rsvp.component';
import {
  ManageLocationsComponent,
} from './components/manage-locations/manage-locations.component';
import { ExtraCreditClassesComponent } from './components/extra-credit-classes/extra-credit-classes.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { VisComponent } from './components/vis/vis.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AddEventDialogComponent } from './components/manage-events/add-event-dialog';
import { AddUserClassDialogComponent } from './components/extra-credit-classes/add-user-class-dialog';
import { AddLocationDialogComponent } from './components/manage-locations/add-location-dialog';
import { UpdateLocationDialogComponent } from './components/manage-locations/update-location-dialog';
import { AddEmailDialogComponent } from './components/send-email/add-email-dialog';
import { UserDataComponent } from './components/user-data/user-data.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ViewUserDataDialogComponent } from './components/user-data/view-user-data-dialog';
import { ManageAdminComponent } from './components/manage-admin/manage-admin.component';
import { LocationDialogComponent } from './components/manage-admin/location-dialog';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidebarComponent,
    UserViewComponent,
    RegistrationTableComponent,
    ManageUsersComponent,
    PreRegistrationTableComponent,
    LiveUpdateComponent,
    SendEmailComponent,
    AddEmailDialogComponent,
    AddEventDialogComponent,
    ManageEventsComponent,
    ManageRsvpComponent,
    ManageLocationsComponent,
    AddLocationDialogComponent,
    UpdateLocationDialogComponent,
    ExtraCreditClassesComponent,
    AddUserClassDialogComponent,
    VisComponent,
    UserDataComponent,
    DashboardComponent,
    ViewUserDataDialogComponent,
    ManageAdminComponent,
    LocationDialogComponent,
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
  ],
  entryComponents: [AddEmailDialogComponent, AddUserClassDialogComponent, AddEventDialogComponent, AddLocationDialogComponent, UpdateLocationDialogComponent, ViewUserDataDialogComponent, LocationDialogComponent],
  providers: [EmailListService, HttpAdminService, AngularFireAuth],
  bootstrap: [AppComponent],
})
export class AppModule {
}
