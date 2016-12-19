import { Router, Request, Response, NextFunction } from "express";
import { DatabaseLogService } from "./../../../../logic/services/database.log.service";

export class LogsRouteV1 {
  constructor (private _router: Router) {}

  createRoutes (): Router {
    // get all errors
    this._router.get("/errors/database", (req: Request, res: Response, next: NextFunction) => {
      res.status(200).json(DatabaseLogService.getErrors());
    });

    // return Router to use in server.ts
    return this._router;
  }
}