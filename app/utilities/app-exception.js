class AppException extends Error{
  constructor(httpErrorCode, appErrorCode, message) {
    super(message);
    this.httpErrorCode = httpErrorCode;
    this.appErrorCode = appErrorCode;
  }
}

export default AppException;
