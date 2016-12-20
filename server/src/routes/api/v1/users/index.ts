import { Router, Request, Response, NextFunction } from "express";
import { UserService } from "./../../../../logic/services/user.service";
import { SocoboUser } from "./../../../../models/socobouser";
import { BackendError } from "./../../../../models/backenderror";
import { ErrorUtils } from "./../../../../utils/ErrorUtils";
let winston = require('winston');

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
              .json(new BackendError("Internal Server Error", error));
        });
    });

    // get user by id
    this._router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
      let id: number = req.params.id;
      this._userService.getUserById(id)
        .then((result: SocoboUser) => res.status(200).json(result))
        .catch((error: any) => {
          if(ErrorUtils.notFoundError(error)){
            res.status(404)
                .json(new BackendError(`The requested user with the id: ${id} does not exist!`, error));
          }else{
            res.status(500)
                .json(new BackendError(`Internal Server Error`, error));
          }



        });
    });

    // return Router to use in server.ts
    return this._router;
  }
}