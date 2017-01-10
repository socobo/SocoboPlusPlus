import { Router, Request, Response, NextFunction } from "express";
import { UserService } from "./../../../../logic/services/user.service";
import { ErrorUtils } from "./../../../../logic/utils/errorUtils";
import { AuthValidator } from "./../../../../logic/middleware/authValidator";
import { 
  ApiError, DbError, SocoboUser 
} from "./../../../../models/index";

import { ERRORS } from "./../../../../errors";

export class UsersRouteV1 {

  constructor (
    private _userService: UserService, 
    private _router: Router,
    private _authValidator: AuthValidator
  ) {}

  createRoutes (): Router {
    // get all users
    this._router.get("/", 
      (req: Request, res: Response, next: NextFunction) => {
        this._authValidator.checkValidToken(req)
          .then(() => next())
          .catch((err: ApiError) => res.status(400).json(err));
      },
      (req: Request, res: Response, next: NextFunction) => {

        this._userService.getAll()
          .then((result: SocoboUser[]) => res.status(200).json(result))
          .catch((error: any) => {
            let e = new ApiError(ERRORS.INTERNAL_SERVER_ERROR)
            e.source = UserService.name;
            e.sourceMethod = "getAllUsers()";
            e.error = error;
            res.status(e.statusCode).json(
              e.forResponse());
          });
    });

    // get user by id
    this._router.get("/:id", 
      (req: Request, res: Response, next: NextFunction) => {
        this._authValidator.checkValidToken(req)
          .then(() => next())
          .catch((err: ApiError) => res.status(400).json(err));
      },
      (req: Request, res: Response, next: NextFunction) => {

        let id: number = req.params.id;

        this._userService.getUserById(id)
          .then((result: SocoboUser) => res.status(200).json(result))
          .catch((error: any) => {
            if (ErrorUtils.notFound(error)) {
              let e = new DbError(ERRORS.USER_NOT_FOUND)
              e.source = UserService.name;
              e.sourceMethod = "getUserById(id)";
              e.error = error;
              e.query = error.query;
              res.status(e.statusCode).json(
                e.forResponse());
            } else {
              let e = new ApiError(ERRORS.INTERNAL_SERVER_ERROR)
              e.source = UserService.name;
              e.sourceMethod = "getUserById(id)";
              e.error = error;
              res.status(e.statusCode).json(
                e.forResponse());
            }
          });
    });

    // return Router to use in server.ts
    return this._router;
  }
}