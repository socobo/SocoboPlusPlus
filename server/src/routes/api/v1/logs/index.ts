import { Router, Request, Response, NextFunction } from "express";
import { LogService } from "./../../../../logic/services/logging.service";
import { AuthValidator } from "./../../../../logic/middleware/authValidator";
import { ApiError } from "./../../../../models/apiError";


export class LogsRouteV1 {
  constructor (
    private _router: Router,
    private _authValidator: AuthValidator
  ) {}

  createRoutes (): Router {
    // get all errors
    this._router.get("/errors", 
      (req: Request, res: Response, next: NextFunction) => {
        this._authValidator.checkValidToken(req)
          .then(() => next())
          .catch((err: ApiError) => res.status(400).json(err));
      }, 
      (req: Request, res: Response, next: NextFunction) => {

        res.status(200).json(LogService.getErrors());
    });

    // return Router to use in server.ts
    return this._router;
  }
}