import { Router, Request, Response, NextFunction } from "express";
import { UserService } from "./../../../../logic/services/user.service";
import { SocoboUser } from "./../../../../models/socobouser";

export class UsersRouteV1 {
  private _userService: UserService;
  private _router:Router; 

  constructor (userService: UserService, router:Router) {
    this._userService = userService;
    this._router = router;
  }

  getUsers (): Router {
    return this._router.get("/", (req: Request, res: Response, next: NextFunction) => {
      this._userService.getAllUsers()
        .then((result:SocoboUser[]) => {
          res.status(200).json(result);
        })
        .catch((error:any) => {
          res.status(404).json(error);
        });
    });
  }
}