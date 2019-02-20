import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AppConstants } from './AppConstants';
import { HttpAdminService } from '../services/http-admin/http-admin.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/AuthService/auth.service';
import { NgProgress } from '@ngx-progressbar/core';
import { CustomErrorHandlerService } from '../services/services';
import { IResponseModel } from '../models/response-model';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private httpService: HttpAdminService,
    private progress: NgProgress,
    private errorHandler: CustomErrorHandlerService,
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkLogin(route.data.privilegeLevel, state.url);
  }

  checkLogin(privilegeLevel: Number = 0, url: string): Observable<boolean> {
    this.progress.start();
    const navExtras = {
      queryParams: {
        redirectUrl: url,
      },
    };
    return this.httpService.getAdminStatus()
      .pipe(
          map((adminData: IResponseModel<{admin: boolean, privilege: number}>) => {
          if (!adminData || !adminData.body.data.admin) {
            this.authService.signOut()
              .then(() => {
                this.progress.complete();
                this.router.navigate([AppConstants.LOGIN_ENDPOINT]);
              });
            return false;
          }
          this.progress.complete();
          return adminData.body.data.privilege >= privilegeLevel;
        }),
        catchError((error) => {
          console.log(error);
          this.errorHandler.handleHttpError(error);
          this.authService.signOut();
          this.router.navigate([AppConstants.LOGIN_ENDPOINT], navExtras);
          this.progress.complete();
          return Observable.of(false);
        }),
      );
  }
}
