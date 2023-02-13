type IResponseCode = 200 | 201 | 400 | 401 | 403 | 404 | 406 | 500;

interface IRCode {
  OK: IResponseCode;
  CREATED: IResponseCode;
  BAD_REQUEST: IResponseCode;
  UNAUTHORIZED: IResponseCode;
  FORBIDDEN: IResponseCode;
  NOT_FOUND: IResponseCode;
  UNPROCURABLE_ENTITY: IResponseCode;
  INTERNAL_SERVER: IResponseCode;
}

export const HttpResponseCode: IRCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCURABLE_ENTITY: 406,
  INTERNAL_SERVER: 500,
};
