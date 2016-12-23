import { Router, Request, Response, NextFunction } from "express";
import { LogService } from "./../../../../logic/services/logging.service";
import { AuthUtils } from "./../../../../logic/utils/authUtils";


export class LogsRouteV1 {
  constructor (private _router: Router) {}

  createRoutes (): Router {
    // get all errors
    this._router.get("/errors", AuthUtils.checkState, (req: Request, res: Response, next: NextFunction) => {
      res.status(200).json(LogService.getErrors());
    });

    // return Router to use in server.ts
    return this._router;
  }
}