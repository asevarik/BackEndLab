// utils/success-response.helper.ts

import { Response } from 'express';
import { HTTPStatusCode } from '../enums/http-status-codes.enum';
import { HTTPAuthSuccessMessages, SuccessMessages } from '../enums/success-messages.enum';

type MessageType = SuccessMessages | HTTPAuthSuccessMessages
export class SuccessResponse {
  static ok(res: Response, data: any, message:MessageType=SuccessMessages.GenericSuccess ) {
    return res.status(HTTPStatusCode.Ok).json({
      statusCode: HTTPStatusCode.Ok,
      message,
      response: data,
    });
  }

  static created(res: Response, data: any, message:MessageType = SuccessMessages.CreateSuccess) {
    return res.status(HTTPStatusCode.Created).json({
      statusCode: HTTPStatusCode.Created,
      message,
      response: data,
    });
  }

  static noContent(res: Response) {
    return res.status(HTTPStatusCode.NoContent).send(); // 204: no body
  }
}
