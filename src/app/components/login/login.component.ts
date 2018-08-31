/**
 * TODO: Add docstring explaining component
 */
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpAdminService } from '../../services/http-admin/http-admin.service';
import { LoginModel } from '../../models/login-model';
import { FormControl, Validators } from '@angular/forms';
import { AuthService, CustomErrorHandlerService } from '../../services/services';
import { NgProgress } from '@ngx-progressbar/core';
import { AuthProviders } from '../../services/AuthService/auth.service';
import { AppConstants } from '../../helpers/AppConstants';
import { AlertService } from 'ngx-alerts';

@Component({
  selector: 'app-login',
  providers: [HttpAdminService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  public errors: Error = null;
  public model: LoginModel;
  email = new FormControl('', [Validators.required, Validators.email]);

  private criticalSectionLock: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private errorHandler: CustomErrorHandlerService,
    private httpService: HttpAdminService,
    private activatedRoute: ActivatedRoute,
    private progressBar: NgProgress,
    private alertsService: AlertService,
  ) {
    this.model = new LoginModel();
    this.criticalSectionLock = false;
    this.authService.currentUser
        .subscribe((user) => {
          if (user) {
            this.onLogin(user);
          }
        });
  }

  login() {
    this.progressBar.start();
    this.loginHandler(this.authService.signInWithProvider(AuthProviders.GOOGLE_PROVIDER));
  }

  loginFacebook() {
    this.progressBar.start();
    this.loginHandler(this.authService.signInWithProvider(AuthProviders.FACEBOOK_PROVIDER));
  }

  loginGithub() {
    this.progressBar.start();
    this.loginHandler(this.authService.signInWithProvider(AuthProviders.GITHUB_PROVIDER));
  }

  loginEmail() {
    this.progressBar.start();
    if (this.model.email && this.model.password) {
      this.loginHandler(this.authService.signIn(this.model.email, this.model.password));
    }
  }

  private loginHandler(loginPromise: Promise<any>) {
    loginPromise
      .then(({ user }) => {
        console.log('Successfully logged in. Verifying credentials now.');
        this.alertsService.info('Verifying privileges and credentials.');
      })
      .catch((error) => {
        console.error(error);
        this.errorHandler.handleError(error);
        this.progressBar.complete();
      });
  }

  onLogin(user: any) {
    if (this.criticalSectionLock) {
      return;
    }
    this.criticalSectionLock = true;
    if (!user) {
      return;
    }
    this.httpService.getAdminStatus()
        .subscribe((result) => {
          if (!result.admin) {
            const error = Error(
              'You do not have the necessary permission to login here. Please contact an administrator.',
            );
            this.errorHandler.handleError(error);
            this.progressBar.complete();
            this.authService.signOut().then(() => {
              this.criticalSectionLock = false;
            }).catch((err) => {
              console.error(err);
              this.criticalSectionLock = false;
            });
            return null;
          }
          this.readRouteAndNavigate((params) => {
            this.criticalSectionLock = false;
            if (!params.redirectUrl) {
              return this.router.navigate([AppConstants.DASHBOARD_ENDPOINT]);
            }
            return this.router.navigate([params['redirectUrl']]);
          });
        },         (error) => {
          console.error(error);
          this.errorHandler.handleError(error);
          this.progressBar.complete();
          this.authService.signOut()
              .then(() => {
                this.criticalSectionLock = false;
              }).catch((err) => {
                console.error(err);
                this.criticalSectionLock = false;
              });
        });
  }

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
           this.email.hasError('email') ? 'Not a valid email' :
           '';
  }

  protected readRouteAndNavigate(callback) {
    this.progressBar.complete();
    this.activatedRoute.queryParams
        .subscribe(callback);
  }
}
