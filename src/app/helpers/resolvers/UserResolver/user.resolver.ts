import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map, take } from 'rxjs/operators';
import { AppConstants } from '../../AppConstants';
import { AuthService } from '../../../services/AuthService/auth.service';
import { NgProgress } from '@ngx-progressbar/core';
import 'rxjs-compat/add/observable/empty';
import 'rxjs-compat/add/observable/of';
import User = firebase.User;

@Injectable()
export class UserResolver implements Resolve<User> {
  constructor(private authService: AuthService,
              private progress: NgProgress,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    this.progress.start();
    return this.authService.currentUser
      .pipe(
        map((user) => {
          if (!user) {
            this.router.navigate([AppConstants.LOGIN_ENDPOINT]);
            return null;
          }
          return user;
        }),
        take(1),
      );
  }
}
