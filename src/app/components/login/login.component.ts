/**
 * Component handles login or authorization to the application. Users have the ability to login
 * via different options such as Local, Google, Facebook, and Github.
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

  /**
   * Login with Google
   */
  login() {
    this.progressBar.start();
    this.loginHandler(this.authService.signInWithProvider(AuthProviders.GOOGLE_PROVIDER));
  }

  /**
   * Login with Facebook
   */
  loginFacebook() {
    this.progressBar.start();
    this.loginHandler(this.authService.signInWithProvider(AuthProviders.FACEBOOK_PROVIDER));
  }

  /**
   * Login with Github
   */
  loginGithub() {
    this.progressBar.start();
    this.loginHandler(this.authService.signInWithProvider(AuthProviders.GITHUB_PROVIDER));
  }
  /**
   * Login with Email
   */
  loginEmail() {
    if (this.model.email && this.model.password) {
      this.progressBar.start();
      this.loginHandler(this.authService.signIn(this.model.email, this.model.password));
    }
  }

  /**
   * Method handles the success of a login attempt and notifies the alert service
   * 
   * @param loginPromise Auth Service Provider Promise
   */
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

  /**
   * Determines the admin status of the user input parameter and routes the user to /dashboard/
   * upon successful authentication. Else the auth service will log the user out and route them
   * to /login/
   * 
   * @param user Firebase user
   */
  onLogin(user: any) {
    if (this.criticalSectionLock) {
      return;
    }
    this.criticalSectionLock = true;
    if (!user) {
      return;
    }
    this.httpService.getAdminStatus()
        .subscribe((result: {admin: boolean, privilege: number}) => {
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

  /**
   * Sets the error message for the email form dependent on the value entered
   */
  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
           this.email.hasError('email') ? 'Not a valid email' :
           '';
  }

  /**
   * Reads the route requested in the query params and routes accordingly
   * 
   * @param callback
   */
  protected readRouteAndNavigate(callback) {
    this.progressBar.complete();
    this.activatedRoute.queryParams
        .subscribe(callback);
  }

  /**
   * Signup for a new account for the application
   * Currently not supported
   */
  signUp() {
    this.errorHandler.handleError(new Error('Not supported'));
  }
}
