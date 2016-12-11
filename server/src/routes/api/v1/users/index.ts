import { Router, Request, Response, NextFunction } from "express";
import { UserService } from "./../../../../logic/services/user.service";
import { SocoboUser } from "./../../../../models/socobouser";
import { BackendError } from "./../../../../models/backenderror";

export class UsersRouteV1 {
  constructor (private _userService: UserService, private _router: Router) {}

  createRoutes (): Router {
    // get all users
    this._router.get("/", (req: Request, res: Response, next: NextFunction) => {
      this._userService.getAllUsers()
        .then((result: SocoboUser[]) => res.status(200).json(result))
        .catch((error: any) => {
          res.status(400)
                .json(new BackendError("The 'AllUsers' Request are failed!", error));
        });
    });

    // get user by id
    this._router.get("/:id", (req: Request, res: Response, next: NextFunction) => {
      let id: number = req.params.id;
      this._userService.getUserById(id)
        .then((result: SocoboUser) => res.status(200).json(result))
        .catch((error: any) => {
          res.status(400)
                .json(new BackendError(`The 'GetUserById' Request with the Id: ${id} are failed!`, error));
        });
    });

    // return Router to use in server.ts
    return this._router;
  }
}