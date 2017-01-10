import { Router, Request, Response, NextFunction } from "express";
import { AuthService } from "./../../../../logic/services/auth.service";
import { ErrorUtils } from "./../../../../logic/utils/errorUtils";
import { AuthValidator } from "./../../../../logic/middleware/authValidator";
import { 
  ApiError, DbError, SocoboUser, LoginResult, ExtractRequestBodyResult
} from "./../../../../models/index";
import { ERRORS } from "./../../../../errors"

export class AuthRouteV1 {

  constructor (
    private _authService: AuthService, 
    private _router: Router,
    private _authValidator: AuthValidator
  ) {}

  createRoutes (): Router {
    // login the user
    this._router.post("/login", 
      (req: Request, res: Response, next: NextFunction) => {
        this._authValidator.checkRequest(req)
          .then(() => next())
          .catch((err: ApiError) => res.status(400).json(err));
      },
      (req: Request, res: Response, next: NextFunction) => {
        this._extractRequestBody(req)
          .then((result: ExtractRequestBodyResult) => {
            return this._authService.login(result.isEmailLogin, 
                                          result.usernameOrEmail, 
                                          result.password); 
          })
          .then((result: LoginResult) => res.status(200).json(result))
          .catch((error: ApiError) => {
            res.status(error.statusCode).json(error.forResponse())
          });
    });

    // register the user
    this._router.post("/register", 
      (req: Request, res: Response, next: NextFunction) => {
        this._authValidator.checkRequest(req)
          .then(() => next())
          .catch((err: ApiError) => res.status(400).json(err));
      },
      (req: Request, res: Response, next: NextFunction) => {
        this._extractRequestBody(req)
          .then((result: ExtractRequestBodyResult) => {
            return this._authService.register(result.isEmailLogin, 
                                              result.usernameOrEmail, 
                                              result.password); 
          })
          .then((result: SocoboUser) => res.status(200).json(result))
          .catch((error: ApiError) => {
            res.status(error.statusCode).json(error.forResponse());
          });
    });

    return this._router;
  }

  private _extractRequestBody (req: Request): Promise<ExtractRequestBodyResult> {
    return new Promise((resolve, reject) => {
      try {
        resolve(new ExtractRequestBodyResult(req.body.isEmailLogin,
                        (req.body.isEmailLogin ? req.body.email : req.body.username)
                        ,req.body.password));
      } catch (err) {
        let e = new ApiError(ERRORS.REQUEST_BODY);
        e.source = AuthRouteV1.name;
        e.sourceMethod = "_extractRequestBody(..)";
        e.error = err
        reject(e);
      }
    });
  }
}