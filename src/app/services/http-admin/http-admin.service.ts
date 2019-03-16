import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import * as uuid from 'uuid/v4';
import 'rxjs/add/observable/throw';
import { map } from 'rxjs/operators';
import { AttendanceModel } from '../../models/attendance-model';
import { CheckoutInstanceModel } from '../../models/checkout-instance-model';
import { ClassesModel } from '../../models/classes-model';
import { EventModel } from '../../models/event-model';
import { IApiResponseModel } from '../../models/api-response-model';
import { ICountModel } from '../../models/count-model';
import { IHackerDataModel } from 'app/models/hacker-model';
import { IStatisticsModel } from '../../models/statistics-model';
import { ItemCheckoutModel } from '../../models/item-checkout-model';
import { LocationModel } from '../../models/location-model';
import { PreRegistrationModel } from '../../models/pre-registration-model';
import { RegistrationModel } from '../../models/registration-model';

import { ApiRoute } from '../../models/ApiRoute';
import { AuthService } from '../AuthService/auth.service';
import { BaseHttpService } from '../base-http/base-http.service';
import { CustomErrorHandlerService } from '../custom-error-handler/custom-error-handler.service';

import * as _ from 'lodash';
import { IHackerRegistrationModel } from 'app/models/hacker-registration-model';
import { query } from '@angular/animations';
import { UpdateModel } from '../../models/update-model';
import { IEventStatisticsModel } from '../../models/event-statistic-model';


@Injectable()
export class HttpAdminService extends BaseHttpService {

  constructor(http: HttpClient, authService: AuthService, errorHandler: CustomErrorHandlerService) {
    super(http, authService, errorHandler);
  }

  /**
   * Gets the admin and privilege status of the current user denoted by the idtoken (found in local memory)
   * 
   * @returns IResponseModel containing admin, privilege properties
   */
  getAdminStatus(): Observable<{admin: boolean, privilege: number}> {
    const apiRoute = new ApiRoute('admin/', true);
    return super.genericGet<IApiResponseModel<{admin: boolean, privilege: number}>>(apiRoute)
      .pipe(
        map(response => response.body.data),
      );
  }

  /**
   * Gets the current list of hackers who have preregistered for the hackathon
   * 
   * @param limit Maximun integer number of PreRegistraion entries to fetch
   * @return Array of hackers who preregistered in PreRegistraitonModel format 
   */
  getPreRegistrations(limit?: number): Observable<PreRegistrationModel[]> {
    const apiRoute = new ApiRoute(
      'admin/preregistered',
      true,
      limit ? new Map<string, any>().set('limit', limit).set('byHackathon', true) : null,
    );
    return super.genericGet<PreRegistrationModel[]>(apiRoute);
  }

  /**
   * Gets the current list of hackers who have registered for the hackathon
   * 
   * @param limit Maximun integer number of Registration entries to fetch
   * @return Array of hackers who registered in RegistrationModel format 
   */
  getRegistrations(limit?: number): Observable<RegistrationModel[]> {
    const apiRoute = new ApiRoute(
      'admin/register',
      true,
      limit ? new Map<string, any>().set('limit', limit) : null,
    );
    return super.genericGet<RegistrationModel[]>(apiRoute);
  }

  /**
   * Gets the current list of available events for the hackathon
   * 
   * @param limit Maximun integer number of Event entries to fetch
   * @returns Array of events for the hackathon in the EventModel format
   */
  getEvents(limit?: number): Observable<EventModel[]> {
    const apiParams = new Map<string, any>();
    apiParams.set('ignoreCache', true);
    if (limit != null) { apiParams.set('limit', limit); }
    const apiRoute = new ApiRoute(
      'live/events',
      true,
      apiParams,
    );
    return super.genericGet<IApiResponseModel<EventModel[]>>(apiRoute)
      .pipe(
        map(response => response.body.data),
      );
  }

  /**
   * Adds a new event to the list of available events for the hackathon
   * 
   * @param event New EventModel format event to add
   * @returns Response containing success message
   */
  addEvent(event: EventModel): Observable<{}> {


    const apiRoute = new ApiRoute(
      'live/events',
      true,
    );
    return super.genericPost<IApiResponseModel<{}>>(apiRoute, event.restRepr());
  }

  /**
   * Updates a current event in the list of available events for the hackathon
   * 
   * @param event Current EvenModel format event to update
   * @returns Response containing success message
   */
  updateEvent(event: EventModel): Observable<{}> {
    const apiRoute = new ApiRoute(
      'live/events/update',
      true,
    );
    return super.genericPost<{}>(apiRoute, event.restRepr());
  }

  /**
   * Gets the firebase unique identifier (UID) for the user associated with the email
   * 
   * @param email Firebase user email address
   * @returns Firebase user profile
   */
  getUserUID(email: string): Observable<{uid: string}> {
    const apiRoute = new ApiRoute(
      'admin/userid',
      true,
      new Map().set('email', email),
    );
    return super.genericGet<IApiResponseModel<{uid: string}>>(apiRoute)
      .pipe(
        map(response => response.body.data),
      );
  }

  /**
   * Elevates the privilege of a user denoted by the unique identifier (UID)
   * 
   * @param uid Firebase unique identifier
   * @param privilege Integer number corresponding to firebase privilege level
   */
  elevateUser(uid: string, privilege: string) {
    const apiRoute = new ApiRoute(
      'admin/makeadmin',
      true,
    );
    return super.genericPost<{}>(apiRoute, { uid, privilege });
  }

  /**
   * Sends an email containing a custom subject and body
   * 
   * @param emailBody 
   * @param emailSubject 
   * @param emailObjects 
   */
  sendEmail(emailBody: string, emailSubject: string, emailObjects: any[]): Observable<any> {
    const chunkedEmails = _.chunk(emailObjects, 100);
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
    return forkJoin(...chunkedEmails.map(batchedEmails => super.genericPost<{}>(
      apiRoute,
      { subject: emailSubject, html: emailBody, emails: batchedEmails },
    )));
  }

  /**
   * Gets the current list of hackers who have RSVP'd for the hackathon
   * 
   * @param limit Maximun integer number of RSVP entries to fetch
   * @return Array of hackers who RSVP'd in RegistrationModel format 
   */
  getRSVPs(limit?: number): Observable<RegistrationModel[]> {
    const apiRoute = new ApiRoute(
      'admin/rsvp_list',
      true,
      limit ? new Map<string, any>().set('limit', limit) : null,
    );
    return super.genericGet<RegistrationModel[]>(apiRoute);
  }

  /**
   * Gets the current list of available events for the hackathon
   * 
   * @param limit Maximun integer number of Event entries to fetch
   * @returns Array of events for the hackathon in the EventModel format
   */
  getLocations(limit?: number): Observable<LocationModel[]> {
    const apiParams = new Map<string, any>();
    if (limit > 0) { apiParams.set('limit', limit); }
    const apiRoute = new ApiRoute(
      'admin/location',
      true,
      apiParams,
    );
    return super.genericGet<IApiResponseModel<LocationModel[]>>(apiRoute)
    .pipe(
      map(response => response.body.data),
    );
  }

  /**
   * Add a new location to the list of available locations to use for events at the hackathon
   * 
   * @param locationName Name of the new location entry 
   */
  addNewLocation(locationName: string) {
    const apiRoute = new ApiRoute(
      'admin/location',
      true,
    );
    return super.genericPost<{}>(apiRoute, { locationName });
  }

  /**
   * Removes the location from the list of available locations to use for events at the hackathon
   * 
   * @param uid Unique identifer (UID) for the location
   */
  removeLocation(uid: string) {
    const apiRoute = new ApiRoute(
      'admin/location/delete',
      true,
    );
    return super.genericPost<{}>(apiRoute, { uid });
  }

  /**
   * Update a location (determined by the UID), in the list of available locations to use for events
   * at the hackathon, to have a new location name
   * 
   * @param uid Unique identifier (UID) for the location
   * @param location_name New name for the location
   */
  updateLocation(uid: string, locationName: string) {
    const apiRoute = new ApiRoute(
      'admin/location/update',
      true,
    );
    return super.genericPost<{}>(apiRoute, { uid, locationName });
  }

  /**
   * Gets the current list of classes that allow for extra credit from attending the hackathon
   * 
   * @param limit Maximun integer number of Extra Credit Classes entries to fetch
   * @returns Array of extra credit classes for the hackathon in the ClassesModel format
   */
  getExtraCreditClasses(limit?: number): Observable<ClassesModel[]> {
    const apiRoute = new ApiRoute(
      'users/extra-credit',
      true,
      limit ? new Map<string, number>().set('limit', limit) : null,
    );
    return super.genericGet<IApiResponseModel<ClassesModel[]>>(apiRoute)
    .pipe(
      map(response => response.body.data),
    );
  }

  /**
   * Associates a hacker with an extra credit class for tracking involvement at the hackathon
   * 
   * @param uid Hacker unique identifier
   * @param cid Class unique identifier
   */
  addHackerToExtraCreditClass(uid: string, cid: string): Observable<{}>  {
    const apiRoute = new ApiRoute(
      'users/extra-credit',
      true,
    );
    return super.genericPost<IApiResponseModel<{}>>(apiRoute, { uid, cid });
  }

  /**
   * Manually sets the hackers attendance status to be checked in with no wristband association
   * 
   * @param uid Hacker unique indentifier
   */
  setHackerCheckedIn(uid: string) {
    const wid = `NO_BAND_${uuid()}`;
    const time: number = new Date().getTime();

    const apiRoute = new ApiRoute(
      'admin/assignment',
      true,

    );
    return super.genericPost<{}>(apiRoute, { assignments: [{ uid, wid, time }] });
  }

  /**
   * Gets a list of all hackers who have preregistered/registered/rsvp'd/checked-in to the hackathon
   * 
   * @param limit Maximun integer number of hacker entries to fetch
   * @returns Array of extra credit classes for the hackathon in the ClassesModel format
   */
  getAllHackers(limit?: number, hackathon?: string): Observable<IApiResponseModel<IHackerDataModel[]>> {
    const queryParams = new Map<string, any>();
    queryParams.set('ignoreCache', true);
    if (limit) { queryParams.set('limit', limit); };
    if (hackathon) { queryParams.set('hackathon', hackathon); };
    const apiRoute = new ApiRoute(
      'admin/data/?type=registration_stats',
      true,
      queryParams,
    );
    return super.genericGet<IApiResponseModel<IHackerDataModel[]>>(apiRoute)
  }

  /**
   * Gets a count of all the hackers who have preregistered for the hackathon
   * 
   * @param limit Maximun integer number PreRegistration Count entries to fetch
   * @returns Integer number count of hackers who have preregisted in the ICountModel format
   */
  getPreRegCount(limit?: number): Observable<ICountModel[]> {
    const apiRoute = new ApiRoute(
      'admin/prereg_count',
      true,
      limit ? new Map<string, any>().set('limit', limit) : null,
    );
    return super.genericGet<ICountModel[]>(apiRoute);
  }
  /**
   * Gets a count of all the hackers who have registered for the hackathon
   * 
   * @param limit Maximun integer number Registered Count entries to fetch
   * @returns Integer number count of hackers who have registered in the ICountModel format
   */
  getRegCount(limit?: number): Observable<ICountModel[]> {
    const apiRoute = new ApiRoute(
      'admin/reg_count',
      true,
      limit ? new Map<string, any>().set('limit', limit) : null,
    );
    return super.genericGet<ICountModel[]>(apiRoute);
  }
  /**
   * Gets a count of all the hackers who have Pre/Reg/RSVP/CheckedIn for the hackathon
   * 
   * @param limit Maximun integer number Pre/Reg/RSVP/CheckedIn Count entries to fetch
   * @returns Integer number count of hackers who have Pre/Reg/RSVP/CheckedIn in the ICountModel format
   */
  getAllHackerCount(hackathon?: string): Observable<ICountModel> {
    const queryParams = new Map<string, any>();
    if (hackathon) { queryParams.set('hackathon', hackathon); }
    const apiRoute = new ApiRoute(
      'admin/data/?type=stats_count',
      true,
      queryParams,
    );
    return super.genericGet<IApiResponseModel<ICountModel>>(apiRoute)
      .pipe(
        map(response => response.body.data[0]),
      );
  }

  /**
   * Gets the count for each category option presented when hackers registered.
   * 
   * @param limit Maximun integer number category option count entries to fetch
   * @retuns Array of counts for each category option in the IStatisticsModel format
   */
  getStatistics(limit?: number): Observable<IStatisticsModel[]> {
    const apiRoute = new ApiRoute(
      'admin/data/?type=registration_category_count',
      true,
      limit ? new Map<string, any>().set('limit', limit) : null,
    );
    return super.genericGet<IStatisticsModel[]>(apiRoute);
  }

  /**
   * Gets the list of available items to checkout for Item Checkout during the hackathon
   * 
   * @returns Array of items that are available in the ItemCheckoutModel format
   */
  getAvailableCheckoutItems(): Observable<ItemCheckoutModel[]> {
    const queryParams = new Map<string, any>();
    queryParams.set('ignoreCache', true);
    const apiRoute = new ApiRoute(
      'admin/checkout/items/availability',
      true,
      queryParams,
    );
    return super.genericGet<IApiResponseModel<ItemCheckoutModel[]>>(apiRoute)
    .pipe(
      map(response => response.body.data),
    );
  }

  addCheckoutRequest(itemId: number, userId: string) {
    const apiRoute = new ApiRoute(
      'admin/checkout',
      true,
    );
    return super.genericPost<{}>(apiRoute, { itemId, userId });
  }

  getCurrentCheckedOutItems(): Observable<CheckoutInstanceModel[]> {
    const queryParams = new Map<string, any>();
    queryParams.set('ignoreCache', true);
    const apiRoute = new ApiRoute(
      'admin/checkout',
      true,
      queryParams,
    );
    return super.genericGet<IApiResponseModel<CheckoutInstanceModel[]>>(apiRoute)
    .pipe(
      map(response => response.body.data),
    );
  }

  getEventAttendance(limit?: number, hackathon?: number): Observable<{}> {
    const queryParams = new Map<string, any>();
    hackathon ? queryParams.set('hackathon', hackathon) : null;
    limit ? new Map<string, any>().set('limit', limit) : null;
    queryParams.set('ignoreCache', true);
    queryParams.set('type', 'attendance');
    queryParams.set('aggregator', 'event')
    const apiRoute = new ApiRoute(
      'admin/data',
      true,
      queryParams,
    );
    return super.genericGet<IApiResponseModel<{}>>(apiRoute)
    .pipe(
      map(response => response.body.data),
    );
  }

  returnCheckoutItem(data: CheckoutInstanceModel) {
    const apiRoute = new ApiRoute(
      'admin/checkout/return',
      true,
    );
    return super.genericPost<{}>(apiRoute, { checkoutId: data.uid });
  }

  sendLiveUpdate(liveUpdate: UpdateModel): Observable<{}> {
    const apiRoute = new ApiRoute(
      'live/updates',
      true,
    );
    return super.genericPost<IApiResponseModel<{}>>(apiRoute, liveUpdate);
  }

  /**
   * Updates the Hacker's Registration Data
   * 
   * @param data Updated Registration data for a Hacker
   */
  updateHackerRegistration(data: IHackerRegistrationModel) {
    const apiRoute = new ApiRoute(
      'admin/register/update',
      true,
    );
    return super.genericPost<{}>(apiRoute, { registration: data });
  }

  getHackathons() {
    const apiRoute = new ApiRoute(
      'admin/hackathon',
      true,
    );
    return super.genericGet<IApiResponseModel<{}>>(apiRoute)
    .pipe(
      map(response => response.body.data),
    );
  }
}
