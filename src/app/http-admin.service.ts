import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConstants } from './AppConstants';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { PreRegistrationModel } from './pre-registration-model';
import { RegistrationModel } from './registration-model';

@Injectable()
export class HttpAdminService {

  constructor(private http: HttpClient) {

  }

  getAdminStatus(user: firebase.User) {
    const API_ENDPOINT = 'users/';
    return Observable.fromPromise(user.getIdToken(true))
      .switchMap((idToken: string) => {
        let headers = new HttpHeaders();
        headers = headers.set('idtoken', idToken);
        return this.http.get<{admin, privilege}>(AppConstants.API_BASE_URL.concat(API_ENDPOINT), { headers });
      });
  }

  getPreRegistrations(user: firebase.User, limit?: number): Observable<PreRegistrationModel[]> {
    const API_ENDPOINT = 'admin/preregistered';
    return Observable.fromPromise(user.getIdToken(true))
      .switchMap((idToken: string) => {
        let myHeader = new HttpHeaders();
        let params = new HttpParams();
        myHeader = myHeader.set('idtoken', idToken);
        if (limit) {
          params = params.set('limit', limit.toString());
        }
        return this.http.get<PreRegistrationModel[]>(AppConstants.API_BASE_URL.concat(API_ENDPOINT), { params, headers: myHeader });
      });
  }

  getRegistrations(user: firebase.User, limit?: number): Observable<RegistrationModel[]> {
    const API_ENDPOINT = 'admin/registered';
    return Observable.fromPromise(user.getIdToken(true))
      .switchMap((idToken: string) => {
        let myHeader = new HttpHeaders();
        let params = new HttpParams();
        myHeader = myHeader.set('idtoken', idToken);
        if (limit) {
          params = params.set('limit', limit.toString());
        }
        return this.http.get<RegistrationModel[]>(AppConstants.API_BASE_URL.concat(API_ENDPOINT), { params, headers: myHeader });
      });
  }


  getUserUID(user: firebase.User, email: string) {
    const API_ENDPOINT = 'admin/userid';
    return Observable.fromPromise(user.getIdToken(true))
      .switchMap((idToken: string) => {
        let myHeader = new HttpHeaders();
        let params = new HttpParams();
        myHeader = myHeader.set('idtoken', idToken);
        params = params.set('email', email);
        return this.http.get<{uid, displayName}>(AppConstants.API_BASE_URL.concat(API_ENDPOINT), { params, headers: myHeader });
      });
  }

  elevateUser(user: firebase.User, uid: string, privilege: string) {
    const API_ENDPOINT = 'admin/makeadmin';
    return Observable.fromPromise(user.getIdToken(true))
      .switchMap((idToken: string) => {
        let myHeader = new HttpHeaders();
        let params = new HttpParams();
        console.log(idToken);
        myHeader = myHeader.set('idtoken', idToken);
        params = params.append('uid', uid);
        params = params.append('privilege', privilege);
        console.log(privilege);
        return this.http.post(AppConstants.API_BASE_URL.concat(API_ENDPOINT), params, { headers: myHeader });
      });
  }
}
