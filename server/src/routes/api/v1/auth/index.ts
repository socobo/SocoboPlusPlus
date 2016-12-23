import { Router, Request, Response, NextFunction } from "express";
import { AuthService } from "./../../../../logic/services/auth.service";
import { ErrorUtils } from "./../../../../logic/utils/errorUtils";
import { ApiError, DbError, SocoboUser } from "./../../../../models/index";


export class AuthRouteV1 {
  constructor (private _authService: AuthService, private _router: Router) {}

  createRoutes (): Router {
    // login the user
    this._router.post("/login", (req: Request, res: Response, next: NextFunction) => {
      this._authService.login(req.body.email, req.body.password)
        .then((result: SocoboUser) => res.status(200).json(result))
        .catch((error: any) => {
          if (ErrorUtils.notFound(error)) {
            res.status(404).json(
                new DbError(`The user login is failed!`, AuthService.name, 
                              "login(email,password)", error).forResponse());
          } else {
            res.status(500).json(
                new ApiError(`Internal Server Error`, AuthService.name, 
                              "login(email,password)", error).forResponse());
          }
        });
    });

    // register the user
    this._router.post("/register", (req: Request, res: Response, next: NextFunction) => {
      this._authService.register(req.body.email, req.body.password)
        .then((result: SocoboUser) => res.status(200).json(result))
        .catch((error: any) => {
          if (ErrorUtils.notFound(error)) {
            res.status(404).json(
                new DbError(`The user registration is failed!`, AuthService.name, 
                              "register(email,password)", error).forResponse());
          } else {
            res.status(500).json(
                new ApiError(`Internal Server Error`, AuthService.name, 
                              "register(email,password)", error).forResponse());
          }
        });
    });

    return this._router;
  }
}