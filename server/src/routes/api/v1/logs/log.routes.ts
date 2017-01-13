import { Router, Request, Response, NextFunction } from "express";
import { LogService } from "./../../../../logic/services/index";
import { AuthValidator } from "./../../../../logic/middleware/index";
import { ApiError } from "./../../../../models/index";


export class LogRoute {
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
          .catch((err: any) => res.status(err.statusCode).json(err.forResponse()));
      }, 
      (req: Request, res: Response, next: NextFunction) => {

        res.status(200).json(LogService.getErrors());
    });

    // return Router to use in server.ts
    return this._router;
  }
}