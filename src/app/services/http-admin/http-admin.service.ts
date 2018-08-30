import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConstants } from '../../helpers/AppConstants';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import * as firebase from 'firebase';
import { PreRegistrationModel } from '../../models/pre-registration-model';
import { RegistrationModel } from '../../models/registration-model';
import { LocationModel } from '../../models/location-model';
import { ClassesModel } from '../../models/classes-model';
import { CountModel } from '../../models/count-model';
import { StatisticsModel } from '../../models/statistics-model';
import 'rxjs-compat/add/observable/from';
import { map } from 'rxjs/operators';

@Injectable()
export class HttpAdminService {
  
  constructor(private http: HttpClient) {
  
  }
  
  getAdminStatus(user: firebase.User): Observable<{ admin, privilege }> {
    const API_ENDPOINT = 'users/';
    return Observable.from(user.getIdToken(true))
      .pipe(
        map((idToken: string) => {
          let headers = new HttpHeaders();
          headers = headers.set('idtoken', idToken);
          return this.http.get<{ admin, privilege }>(AppConstants.API_BASE_URL.concat(API_ENDPOINT), { headers });
        }));
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
        return this.http.get<{ uid, displayName }>(AppConstants.API_BASE_URL.concat(API_ENDPOINT), { params, headers: myHeader });
      });
  }
  
  elevateUser(user: firebase.User, uid: string, privilege: string) {
    const API_ENDPOINT = 'admin/makeadmin';
    return Observable.fromPromise(user.getIdToken(true))
      .switchMap((idToken: string) => {
        let myHeader = new HttpHeaders();
        const params = new HttpParams();
        myHeader = myHeader.set('idtoken', idToken);
        return this.http.post(AppConstants.API_BASE_URL.concat(API_ENDPOINT), { uid, privilege }, { headers: myHeader });
      });
  }
  
  sendEmail(user: firebase.User, emailBody: string, emailSubject: string, emailObjects: any[]): Observable<any> {
    console.log(emailSubject, emailObjects);
    const API_ENDPOINT = 'admin/email';
    return Observable.fromPromise(user.getIdToken(true))
      .switchMap((idToken: string) => {
        let myHeader = new HttpHeaders();
        const params = new HttpParams();
        myHeader = myHeader.set('idtoken', idToken);
        
        // CHECK THAT REPLACEMENTS ARE VALID
        const replacements = emailBody.match(/\$\w+\$/g);
        replacements.forEach((replacement) => {
          emailObjects.forEach((object) => {
            const key = replacement.replace(/\$/g, '');
            if (!object.substitutions
                || object.substitutions[key] === null
                || typeof object.substitutions[key] === 'undefined') {
              throw Observable.throw('Replacements are invalid: ' + key);
            }
          })
        });
        return this.http.post(AppConstants.API_BASE_URL.concat(API_ENDPOINT),
          { subject: emailSubject, html: emailBody, emails: emailObjects },
          { headers: myHeader });
      });
  }
  
  getRSVP(user: firebase.User, limit?: number): Observable<RegistrationModel[]> {
    const API_ENDPOINT = 'admin/rsvp_list';
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
  
  getLocations(user: firebase.User, limit?: number): Observable<LocationModel[]> {
    const API_ENDPOINT = 'admin/location_list';
    return Observable.fromPromise(user.getIdToken(true))
      .switchMap((idToken: string) => {
        let myHeader = new HttpHeaders();
        let params = new HttpParams();
        //console.log(idToken);
        myHeader = myHeader.set('idtoken', idToken);
        if (limit) {
          params = params.set('limit', limit.toString());
        }
        return this.http.get<LocationModel[]>(AppConstants.API_BASE_URL.concat(API_ENDPOINT), { params, headers: myHeader });
      });
  }
  
  addNewLocation(user: firebase.User, locationName: string) {
    const API_ENDPOINT = 'admin/create_location';
    return Observable.fromPromise(user.getIdToken(true))
      .switchMap((idToken: string) => {
        let myHeader = new HttpHeaders();
        const params = new HttpParams();
        myHeader = myHeader.set('idtoken', idToken);
        return this.http.post(AppConstants.API_BASE_URL.concat(API_ENDPOINT), { locationName }, { headers: myHeader });
      });
  }
  
  removeLocation(user: firebase.User, uid: string) {
    uid = uid.toString();
    const API_ENDPOINT = 'admin/remove_location';
    return Observable.fromPromise(user.getIdToken(true))
      .switchMap((idToken: string) => {
        let myHeader = new HttpHeaders();
        const params = new HttpParams();
        console.log(idToken);
        myHeader = myHeader.set('idtoken', idToken);
        return this.http.post(AppConstants.API_BASE_URL.concat(API_ENDPOINT), { uid }, { headers: myHeader });
      });
  }
  
  updateLocation(user: firebase.User, uid: string, location_name: string) {
    uid = uid.toString();
    const API_ENDPOINT = 'admin/update_location';
    return Observable.fromPromise(user.getIdToken(true))
      .switchMap((idToken: string) => {
        let myHeader = new HttpHeaders();
        const params = new HttpParams();
        myHeader = myHeader.set('idtoken', idToken);
        return this.http.post(AppConstants.API_BASE_URL.concat(API_ENDPOINT), { uid, location_name }, { headers: myHeader });
      });
  }
  
  getExtraCreditClasses(user: firebase.User, limit?: number): Observable<ClassesModel[]> {
    const API_ENDPOINT = 'admin/extra_credit_list';
    return Observable.fromPromise(user.getIdToken(true))
      .switchMap((idToken: string) => {
        let myHeader = new HttpHeaders();
        let params = new HttpParams();
        myHeader = myHeader.set('idtoken', idToken);
        if (limit) {
          params = params.set('limit', limit.toString());
        }
        return this.http.get<ClassesModel[]>(AppConstants.API_BASE_URL.concat(API_ENDPOINT), { params, headers: myHeader });
      });
  }
  
  addUserToExtraClass(user: firebase.User, uid: string, cid: string) {
    const API_ENDPOINT = 'admin/assign_extra_credit';
    return Observable.fromPromise(user.getIdToken(true))
      .switchMap((idToken: string) => {
        let myHeader = new HttpHeaders();
        const params = new HttpParams();
        myHeader = myHeader.set('idtoken', idToken);
        return this.http.post(AppConstants.API_BASE_URL.concat(API_ENDPOINT), { uid, cid }, { headers: myHeader });
      });
  }
  
  getAllUsers(user: firebase.User, limit?: number): Observable<PreRegistrationModel[]> {
    const API_ENDPOINT = 'admin/user_data';
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
  
  getPreRegCount(user: firebase.User, limit?: number): Observable<CountModel[]> {
    const API_ENDPOINT = 'admin/prereg_count';
    return Observable.fromPromise(user.getIdToken(true))
      .switchMap((idToken: string) => {
        let myHeader = new HttpHeaders();
        let params = new HttpParams();
        myHeader = myHeader.set('idtoken', idToken);
        if (limit) {
          params = params.set('limit', limit.toString());
        }
        return this.http.get<CountModel[]>(AppConstants.API_BASE_URL.concat(API_ENDPOINT), { params, headers: myHeader });
      });
  }
  
  getRegCount(user: firebase.User, limit?: number): Observable<CountModel[]> {
    const API_ENDPOINT = 'admin/reg_count';
    return Observable.fromPromise(user.getIdToken(true))
      .switchMap((idToken: string) => {
        let myHeader = new HttpHeaders();
        let params = new HttpParams();
        myHeader = myHeader.set('idtoken', idToken);
        if (limit) {
          params = params.set('limit', limit.toString());
        }
        return this.http.get<CountModel[]>(AppConstants.API_BASE_URL.concat(API_ENDPOINT), { params, headers: myHeader });
      });
  }
  
  getAllUserCount(user: firebase.User, limit?: number): Observable<CountModel[]> {
    const API_ENDPOINT = 'admin/user_count';
    return Observable.fromPromise(user.getIdToken(true))
      .switchMap((idToken: string) => {
        let myHeader = new HttpHeaders();
        let params = new HttpParams();
        console.log(idToken);
        myHeader = myHeader.set('idtoken', idToken);
        if (limit) {
          params = params.set('limit', limit.toString());
        }
        return this.http.get<CountModel[]>(AppConstants.API_BASE_URL.concat(API_ENDPOINT), { params, headers: myHeader });
      });
  }
  
  getStatistics(user: firebase.User, limit?: number): Observable<StatisticsModel[]> {
    const API_ENDPOINT = 'admin/statistics';
    return Observable.fromPromise(user.getIdToken(true))
      .switchMap((idToken: string) => {
        let myHeader = new HttpHeaders();
        let params = new HttpParams();
        console.log(idToken);
        myHeader = myHeader.set('idtoken', idToken);
        if (limit) {
          params = params.set('limit', limit.toString());
        }
        return this.http.get<StatisticsModel[]>(AppConstants.API_BASE_URL.concat(API_ENDPOINT), { params, headers: myHeader });
      });
  }
}
