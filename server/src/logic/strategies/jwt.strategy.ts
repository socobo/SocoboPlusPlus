import { Passport } from "passport";
import * as jwtStrategy from "passport-jwt";

import { UserService } from './../services/user.service';
import { SocoboUser } from './../../models/socoboUser';
import { Config } from './../../config';


export class JwtAuthStrategy {

  constructor (private passport: Passport, private userService: UserService) {}

  setup (): void {
    let opts: jwtStrategy.StrategyOptions;
    opts.secretOrKey = Config.TOKEN_SECRET;
    
    this.passport.use(new jwtStrategy.Strategy(opts, (jwt_payload, done) => {
      this.userService.getUserById(jwt_payload.id)
        .then((result: SocoboUser) => done(null, result))
        .catch((error: any) => done(error, null));
    }));
  }
}