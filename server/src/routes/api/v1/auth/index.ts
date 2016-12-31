import { Router, Request, Response, NextFunction } from "express";
import { AuthService } from "./../../../../logic/services/auth.service";
import { ErrorUtils } from "./../../../../logic/utils/errorUtils";
import { AuthValidator } from "./../../../../logic/middleware/authValidator";
import { 
  ApiError, DbError, SocoboUser, LoginResult 
} from "./../../../../models/index";


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

      let isEmailLogin: boolean = req.body.isEmailLogin;
      let usernameOrEmail: string = isEmailLogin ? req.body.email : req.body.username;
      let password: string = req.body.password;

      this._authService.login(isEmailLogin, usernameOrEmail, password)
        .then((result: LoginResult) => res.status(200).json(result))
        .catch((error: any) => {
          if (ErrorUtils.notFound(error)) {
            res.status(404).json(
                new DbError(`The given Username or Email was not found - '${error.message}'!`, AuthService.name, 
                              "login(email,password)", error).forResponse());
          } else {
            res.status(500).json(
                new ApiError(`Internal Server Error: ${error.message}`, AuthService.name, 
                              "login(email,password)", error).forResponse());
          }
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
      
      let isEmailLogin: boolean = req.body.isEmailLogin;
      let usernameOrEmail: string = isEmailLogin ? req.body.email : req.body.username;
      let password: string = req.body.password;

      this._authService.register(isEmailLogin, usernameOrEmail, password)
        .then((result: SocoboUser) => res.status(200).json(result))
        .catch((error: any) => {
          res.status(500).json(
              new ApiError(`Internal Server Error: ${error.message}`, AuthService.name, 
                            "register(email,password)", error).forResponse());
        });
    });

    return this._router;
  }
}