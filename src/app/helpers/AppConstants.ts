import { environment } from '../../environments/environment';

export class AppConstants {

  // public static API_BASE_URL: String = 'https://api.hackpsu.org/v1/';
  public static API_BASE_URL: String = environment.apiUrl;
  // public static SOCKET_BASE_URL: String = 'https://api.hackpsu.org';
  public static SOCKET_BASE_URL: String = 'http://localhost:5000/';
  public static LOGIN_ENDPOINT = '/login';
  public static REGISTRATION_ENDPOINT = '/registrations';
  public static PRE_REGISTRATION_ENDPOINT = '/preregistrations';
  public static EMAIL_ENDPOINT =  '/email';
  public static HTML_TEMPLATE = '../../assets/email_template.ts';
  public static DASHBOARD_ENDPOINT =  '/dashboard';
}
