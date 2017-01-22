import { NextFunction, Request, Response, Router } from "express";
import { AuthValidationMiddleware } from "./../../../../logic/middleware/index";
import { AuthService } from "./../../../../logic/services/index";
import { ErrorUtils } from "./../../../../logic/utils/index";
import {
  ApiError, DbError, ERRORS, ExtractRequestBodyResult, LoginResponse, SocoboUser
} from "./../../../../models/index";

export class AuthRoute {

  constructor (
    private _authService: AuthService,
    private _router: Router,
    private _authValidationMiddleware: AuthValidationMiddleware
  ) {}

  public createRoutes (): Router {
    // login the user
    this._router.post("/login",
      (req: Request, res: Response, next: NextFunction) => {
        this._authValidationMiddleware.checkRequest(req)
          .then(() => next())
          .catch((err: any) => res.status(err.statusCode).json(err.forResponse()));
        },
      (req: Request, res: Response, next: NextFunction) => {
        this._extractRequestBody(req)
          .then((result: ExtractRequestBodyResult) => {
            return this._authService.login(result.isEmailLogin,
                                           result.usernameOrEmail,
                                           result.password);
          })
          .then((result: LoginResponse) => res.status(200).json(result))
          .catch((error: any) => {
            res.status(error.statusCode).json(error.forResponse());
          });
        }
    );

    // register the user
    this._router.post("/register",
      (req: Request, res: Response, next: NextFunction) => {
        this._authValidationMiddleware.checkRequest(req)
          .then(() => next())
          .catch((error: any) => res.status(error.statusCode).json(error.forResponse()));
        },
      (req: Request, res: Response, next: NextFunction) => {
        this._extractRequestBody(req)
          .then((result: ExtractRequestBodyResult) => {
            return this._authService.register(result.isEmailLogin,
                                              result.usernameOrEmail,
                                              result.password);
          })
          .then((result: SocoboUser) => res.status(201).json(result))
          .catch((error: any) => {
            res.status(error.statusCode).json(error.forResponse());
          });
        }
    );

    return this._router;
  }

  private _extractRequestBody (req: Request): Promise<ExtractRequestBodyResult> {
    return new Promise((resolve, reject) => {
      try {
        resolve(new ExtractRequestBodyResult(req.body.isEmailLogin,
                        (req.body.isEmailLogin ? req.body.email : req.body.username),
                        req.body.password));
      } catch (err) {
        const e = new ApiError(ERRORS.REQUEST_BODY)
          .addSource(AuthRoute.name)
          .addSourceMethod("_extractRequestBody(..)")
          .addCause(err);
        reject(e);
      }
    });
  }
}
