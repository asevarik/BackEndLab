import createError from 'http-errors';
import { HTTPMessages } from '../models/http-messages';
import { HTTPStatusCode } from '../enums/http-status-codes.enum';

//ADDED DATA FIELD IN THE ERROR OBJECT TO SEND THE CUSTOM RESPONSE TO THE USER
export class BadRequestException {
  constructor(message = HTTPMessages.BAD_REQUEST, data?: any) {
    const error = createError(HTTPStatusCode.BadRequest, message) as any;
    if (data) error.data = data;
    throw error;
  }
}

export class UnauthorizedException extends createError.Unauthorized{
  public data?: any;

  constructor(message = HTTPMessages.UNAUTHORIZED, data?: any) {
    super(message);
    this.data = data;

    // Fix prototype chain to allow instanceof to work
    Object.setPrototypeOf(this, UnauthorizedException.prototype);
    
  }
}

export class NotFoundException {
  constructor(message = HTTPMessages.NOT_FOUND, data?: any) {
    const error = createError(HTTPStatusCode.NotFound, message) as any;
    if (data) error.data = data;
    throw error;
  }
}

export class ConflictException {
  constructor(message = HTTPMessages.CONFLICT, data?: any) {
    const error = createError(HTTPStatusCode.Conflict, message) as any;
    if (data) error.data = data;
    throw error;
  }
}

export class UnprocessableEntityException {
  constructor(message = HTTPMessages.UNPROCESSABLE_ENTITY, data?: any) {
    const error = createError(HTTPStatusCode.UnprocessableEntity, message) as any;
    if (data) error.data = data;
    throw error;
  }
}

export class TooManyRequestsException {
  constructor(message = HTTPMessages.TOO_MANY_REQUESTS, data?: any) {
    const error = createError(HTTPStatusCode.TooManyRequests, message) as any;
    if (data) error.data = data;
    throw error;
  }
}

export class InternalServerErrorException {
  constructor(message = HTTPMessages.INTERNAL_SERVER_ERROR, data?: any) {
    const error = createError(HTTPStatusCode.InternalServerError, message) as any;
    if (data) error.data = data;
    throw error;
  }
}

export class BadGatewayException {
  constructor(message = HTTPMessages.BAD_GATEWAY, data?: any) {
    const error = createError(HTTPStatusCode.BadGateway, message) as any;
    if (data) error.data = data;
    throw error;
  }
}
