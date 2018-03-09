import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../environments/environment';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UserViewComponent } from './user-view/user-view.component';
import { HttpClientModule } from '@angular/common/http';
import { CustomMaterialModule } from './custom.materials'
import { RegistrationTableComponent } from './registration-table/registration-table.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { PreRegistrationTableComponent } from './pre-registration-table/pre-registration-table.component';
import { LiveUpdateComponent } from './live-update/live-update.component';

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
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    CustomMaterialModule,
  ],
  providers: [AngularFireAuth],
  bootstrap: [AppComponent],
})
export class AppModule {
}
