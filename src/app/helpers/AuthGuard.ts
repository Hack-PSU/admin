import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AppConstants } from './AppConstants';
import { HttpAdminService } from '../services/http-admin/http-admin.service';
import { Observable } from 'rxjs/Observable';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AuthService } from '../services/AuthService/auth.service';
import { NgProgress } from '@ngx-progressbar/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService,
              private router: Router,
              private httpService: HttpAdminService,
              private progress: NgProgress) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkLogin(route.data.privilegeLevel);
  }

  checkLogin(privilegeLevel: Number = 0): Observable<boolean> {
    this.progress.start();
    return this.authService.currentUser
      .pipe(
        mergeMap((user) => {
          if (!user) {
            this.router.navigate([AppConstants.LOGIN_ENDPOINT]);
            this.progress.complete();
            return Observable.of(false);
          }
          return this.httpService.getAdminStatus(user)
            .pipe(
              map((adminData: { admin: boolean, privilege: Number }) => {
                if (!adminData || !adminData.admin) {
                  this.authService.signOut();
                  this.router.navigate([AppConstants.LOGIN_ENDPOINT]);
                  this.progress.complete();
                  return false;
                }
                this.progress.complete();
                return adminData.privilege >= privilegeLevel;
              }),
            );
        }),
        catchError(() => {
          this.authService.signOut();
          this.router.navigate([AppConstants.LOGIN_ENDPOINT]);
          this.progress.complete();
          return Observable.of(false);
        }),
      );
  }
}
