export class ResponseDTO<T> {
  statusCode: number;
  data: T;
  message?: string | [string] | {};

  constructor(statusCode: number, data: T, message?: string | [string]) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
}
