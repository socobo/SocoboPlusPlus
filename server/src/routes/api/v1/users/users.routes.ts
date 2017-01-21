import { NextFunction, Request, Response, Router } from "express";
import { AuthValidator } from "./../../../../logic/middleware/index";
import { UserService } from "./../../../../logic/services/user.service";
import { ErrorUtils } from "./../../../../logic/utils/index";
import {
  ApiError, DbError, ERRORS, SocoboUser
} from "./../../../../models/index";

export class UsersRoute {

  constructor (
    private _userService: UserService,
    private _router: Router,
    private _authValidator: AuthValidator
  ) {}

  public createRoutes (): Router {
    // get all users
    this._router.get("/",
      (req: Request, res: Response, next: NextFunction) => {
        this._authValidator.checkValidToken(req)
          .then(() => next())
          .catch((e: any) => res.status(e.statusCode).json(e.forResponse()));
      },
      (req: Request, res: Response, next: NextFunction) => {
        this._userService.getAll()
          .then((result: SocoboUser[]) => res.status(200).json(result))
          .catch((e: any) => {
            res.status(e.statusCode).json(e.forResponse());
          });
    });

    // get user by id
    this._router.get("/:id",
      (req: Request, res: Response, next: NextFunction) => {
        this._authValidator.checkValidToken(req)
          .then(() => next())
          .catch((err: any) => res.status(err.statusCode).json(err.forResponse()));
      },
      (req: Request, res: Response, next: NextFunction) => {
        this._userService.getUserById(req.params.id)
          .then((result: SocoboUser) => res.status(200).json(result))
          .catch((e: any) => {
            res.status(e.statusCode).json(e.forResponse());
          });
    });

    // return Router to use in server.ts
    return this._router;
  }
}
