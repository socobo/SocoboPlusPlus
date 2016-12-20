import { Router, Request, Response, NextFunction } from "express";
import { UserService } from "./../../../../logic/services/user.service";
import { SocoboUser } from "./../../../../models/socobouser";
import { ApiError } from "./../../../../models/api-error";
import { DbError } from "./../../../../models/db-error";
import { ErrorUtils } from "./../../../../utils/ErrorUtils";

export class UsersRouteV1 {
  constructor (private _userService: UserService, private _router: Router) {
  }

  createRoutes (): Router {
    // get all users
    this._router.get("/", (req: Request, res: Response, next: NextFunction) => {
      this._userService.getAllUsers()
        .then((result: SocoboUser[]) => {
          res.status(200).json(result)})
        .catch((error: any) => {
          res.status(500)
              .json(new ApiError("Internal Server Error", error).forResponse());
        });
    });

    // get user by id
    this._router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
      let id: number = req.params.id;

      this._userService.getUserById(id)
        .then((result: SocoboUser) => res.status(200).json(result))
        .catch((error: any) => {
          if (ErrorUtils.notFoundError(error)) {
            res.status(404)
                .json(new DbError(`The requested user with the id: ${id} does not exist!`, error).forResponse());
          } else {
            res.status(500)
                .json(new ApiError(`Internal Server Error`, error).forResponse());
          }
        });
    });

    // return Router to use in server.ts
    return this._router;
  }
}