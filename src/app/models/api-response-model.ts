export interface IApiResponseModel<T> {
  api_response: string;
  status: number;
  body: {
    result: string;
    data: T;
  }
}
