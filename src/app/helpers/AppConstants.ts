export class AppConstants {
  //public static API_BASE_URL: String = 'https://api.hackpsu.org/v1/';
  public static API_BASE_URL: String = "http://localhost:5000/v1/";
  //public static SOCKET_BASE_URL: String = 'https://api.hackpsu.org';
  public static SOCKET_BASE_URL: String = "http://localhost:5000/";
  public static LOGIN_ENDPOINT = '/login';
  public static REGISTRATION_ENDPOINT = '/registrations';
  public static PRE_REGISTRATION_ENDPOINT = '/preregistrations';
  public static EMAIL_ENDPOINT =  '/email';
  static HTML_TEMPLATE = '../../assets/email_template.ts';
}
