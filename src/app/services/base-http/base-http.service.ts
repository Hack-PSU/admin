import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService, CustomErrorHandlerService } from '../services';
import { AppConstants } from '../../helpers/AppConstants';
import { Observable } from 'rxjs';
import { ApiRoute } from '../../models/ApiRoute';
import { catchError, retry, switchMap } from 'rxjs/operators';

export abstract class BaseHttpService {
  private static readonly BASE_URL = AppConstants.API_BASE_URL;
  private readonly CACHE_SIZE = 3;
  protected memCache: Map<ApiRoute, Observable<any>>;

  protected constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorHandler: CustomErrorHandlerService,
  ) {
    this.memCache = new Map<ApiRoute, Observable<any>>();
  }

  protected genericGet<T>(apiRoute: ApiRoute): Observable<T> {
    if (!this.memCache.has(apiRoute)) {
      let observable;
      if (apiRoute.needsAuthentication) {
        observable = this.authService.idToken
                         .pipe(
                           switchMap((idToken: string) => {
                             if (!idToken) {
                               return Observable.throwError(new HttpErrorResponse({
                                 error: 'You are not logged in. Redirecting now.',
                                 status: 401,
                               }));
                             }
                             let headers = new HttpHeaders();
                             headers = headers.set('idtoken', idToken);
                             let params = new HttpParams();
                             if (apiRoute.queryParams) {
                               apiRoute.queryParams.forEach((value, key) => {
                                 params = params.append(key, value);
                               });
                             }
                             return this.http.get<T>(
                               `${BaseHttpService.BASE_URL}/${apiRoute.URL}`,
                               { headers, params, reportProgress: true },
                             );
                           }),
                         );
      } else {
        observable = this.http.get<T>(
          `${BaseHttpService.BASE_URL}/${apiRoute.URL}`,
          { reportProgress: true },
        );
      }
      this.memCache.set(apiRoute, observable
        .shareReplay(this.CACHE_SIZE, 10 * 1000)
        .pipe(
          retry(3),
        ),
      );
    }
    return this.memCache.get(apiRoute);
  }

  protected genericPost<T>(apiRoute: ApiRoute, data: any) {
    this.memCache.set(apiRoute, null);
    return this.authService.idToken.pipe(
      switchMap((idToken: string) => {
        if (!idToken) {
          return Observable.throwError('You are not logged in. Redirecting now.');
        }
        let headers = new HttpHeaders();
        headers = headers.set('idtoken', idToken);
        return this.http.post(
          `${AppConstants.API_BASE_URL}${apiRoute.URL}`,
          data,
          { headers, reportProgress: true },
        );
      }),
      catchError(err => this.errorHandler.handleHttpError(err)),
    );
  }
}
