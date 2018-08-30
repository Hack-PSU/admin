export class ApiRoute {
  public URL: string;
  public needsAuthentication: boolean;
  public queryParams: Map<string, any> | null;

  constructor(URL: string, needsAuthentication: boolean, queryParams?: Map<string, any>) {
    this.URL = URL;
    this.needsAuthentication = needsAuthentication;
    this.queryParams = queryParams || null;
  }
}
