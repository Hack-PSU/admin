import { TestBed, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { UserViewComponent } from './components/user-view/user-view.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RegistrationTableComponent } from './components/registration-table/registration-table.component';
import { LoginComponent } from './components/login/login.component';
import { AngularFireAuth, AngularFireAuthModule } from 'angularfire2/auth';
import { CustomMaterialModule } from './helpers/custom.materials';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './helpers/app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { FormsModule } from '@angular/forms';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        LoginComponent,
        SidebarComponent,
        UserViewComponent,
        RegistrationTableComponent,
      ],
      imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        CustomMaterialModule,
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'app works!'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('app works!');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('app works!');
  }));
});
