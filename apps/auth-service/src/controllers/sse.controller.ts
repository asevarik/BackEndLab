import { NextFunction, Request, Response } from "express";
import { sseStore } from "../services/admin_metrics.services";
import { SuccessResponse } from "../shared/utils/success-response.helper";
import { SuccessMessages } from "../shared/enums/success-messages.enum";

export const sseMetricsController = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const clientId = req.body.decodedToken.userId;
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  sseStore.addClient(clientId, res);
  //if the client has been connected
  SuccessResponse.ok(res, {}, SuccessMessages.SEEConnectedSuccess);

  req.on("close", () => {
    sseStore.removeClient(clientId);
    console.log("client Removed");
  });
};
