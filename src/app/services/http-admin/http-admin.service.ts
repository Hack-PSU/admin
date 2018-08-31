import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { PreRegistrationModel } from '../../models/pre-registration-model';
import { RegistrationModel } from '../../models/registration-model';
import { LocationModel } from '../../models/location-model';
import { ClassesModel } from '../../models/classes-model';
import { CountModel } from '../../models/count-model';
import { StatisticsModel } from '../../models/statistics-model';
import 'rxjs-compat/add/observable/from';
import { ApiRoute } from '../../models/ApiRoute';
import { CustomErrorHandlerService } from '../custom-error-handler/custom-error-handler.service';
import { BaseHttpService } from '../base-http/base-http.service';
import { AuthService } from '../AuthService/auth.service';

@Injectable()
export class HttpAdminService extends BaseHttpService {

  constructor(http: HttpClient, authService: AuthService, errorHandler: CustomErrorHandlerService) {
    super(http, authService, errorHandler);
  }

  getAdminStatus(): Observable<{ admin, privilege }> {
    const apiRoute = new ApiRoute('users/', true);
    return super.genericGet<{ admin, privilege }>(apiRoute);
  }

  getPreRegistrations(limit?: number): Observable<PreRegistrationModel[]> {
    const apiRoute = new ApiRoute(
      'admin/preregistered',
      true,
      limit ? new Map<string, any>().set('limit', limit) : null,
    );
    return super.genericGet<PreRegistrationModel[]>(apiRoute);
  }

  getRegistrations(limit?: number): Observable<RegistrationModel[]> {
    const apiRoute = new ApiRoute(
      'admin/registered',
      true,
      limit ? new Map<string, any>().set('limit', limit) : null,
    );
    return super.genericGet<RegistrationModel[]>(apiRoute);
  }

  getUserUID(email: string) {
    const apiRoute = new ApiRoute(
      'admin/userid',
      true,
      new Map().set('email', email),
    );
    return super.genericGet<{ uid, displayName }>(apiRoute);
  }

  elevateUser(uid: string, privilege: string) {
    const apiRoute = new ApiRoute(
      'admin/makeadmin',
      true,
    );
    return super.genericPost<{}>(apiRoute, { uid, privilege });
  }

  sendEmail(emailBody: string, emailSubject: string, emailObjects: any[]): Observable<any> {
    const apiRoute = new ApiRoute(
      'admin/email',
      true,
    );
    // CHECK THAT REPLACEMENTS ARE VALID
    const replacements = emailBody.match(/\$\w+\$/g);
    try {
      replacements.forEach((replacement) => {
        emailObjects.forEach((object) => {
          const key = replacement.replace(/\$/g, '');
          if (!object.substitutions
              || object.substitutions[key] === null
              || typeof object.substitutions[key] === 'undefined') {
            throw new Error('Replacements are invalid: ' + key);
          }
        });
      });
    } catch (error) {
      return Observable.throwError(error);
    }
    return super.genericPost<{}>(
      apiRoute,
      { subject: emailSubject, html: emailBody, emails: emailObjects },
    );
  }

  getRSVP(limit?: number): Observable<RegistrationModel[]> {
    const apiRoute = new ApiRoute(
      'admin/rsvp_list',
      true,
      limit ? new Map<string, any>().set('limit', limit) : null,
    );
    return super.genericGet<RegistrationModel[]>(apiRoute);
  }

  getLocations(limit?: number): Observable<LocationModel[]> {
    const apiRoute = new ApiRoute(
      'admin/location_list',
      true,
      limit ? new Map<string, any>().set('limit', limit) : null,
    );
    return super.genericGet<LocationModel[]>(apiRoute);
  }

  addNewLocation(locationName: string) {
    const apiRoute = new ApiRoute(
      'admin/create_location',
      true,
    );
    return super.genericPost<{}>(apiRoute, { locationName });
  }

  removeLocation(uid: string) {
    const apiRoute = new ApiRoute(
      'admin/remove_location',
      true,
    );
    return super.genericPost<{}>(apiRoute, { uid });
  }

  updateLocation(uid: string, location_name: string) {
    const apiRoute = new ApiRoute(
      'admin/update_location',
      true,
    );
    return super.genericPost<{}>(apiRoute, { uid, locationName: location_name });
  }

  getExtraCreditClasses(limit?: number): Observable<ClassesModel[]> {
    const apiRoute = new ApiRoute(
      'admin/extra_credit_list',
      true,
      limit ? new Map<string, any>().set('limit', limit) : null,
    );
    return super.genericGet<ClassesModel[]>(apiRoute);
  }

  addUserToExtraClass(uid: string, cid: string) {
    const apiRoute = new ApiRoute(
      'admin/assign_extra_credit',
      true,
    );
    return super.genericPost<{}>(apiRoute, { uid, cid });
  }

  getAllUsers(limit?: number): Observable<PreRegistrationModel[]> {
    const apiRoute = new ApiRoute(
      'admin/user_data',
      true,
      limit ? new Map<string, any>().set('limit', limit) : null,
    );
    return super.genericGet<PreRegistrationModel[]>(apiRoute);
  }

  getPreRegCount(limit?: number): Observable<CountModel[]> {
    const apiRoute = new ApiRoute(
      'admin/prereg_count',
      true,
      limit ? new Map<string, any>().set('limit', limit) : null,
    );
    return super.genericGet<CountModel[]>(apiRoute);
  }

  getRegCount(limit?: number): Observable<CountModel[]> {
    const apiRoute = new ApiRoute(
      'admin/reg_count',
      true,
      limit ? new Map<string, any>().set('limit', limit) : null,
    );
    return super.genericGet<CountModel[]>(apiRoute);
  }

  getAllUserCount(limit?: number): Observable<CountModel[]> {
    const apiRoute = new ApiRoute(
      'admin/user_count',
      true,
      limit ? new Map<string, any>().set('limit', limit) : null,
    );
    return super.genericGet<CountModel[]>(apiRoute);
  }

  getStatistics(limit?: number): Observable<StatisticsModel[]> {
    const apiRoute = new ApiRoute(
      'admin/statistics',
      true,
      limit ? new Map<string, any>().set('limit', limit) : null,
    );
    return super.genericGet<StatisticsModel[]>(apiRoute);
  }
}
