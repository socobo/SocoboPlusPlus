import { IDatabase } from "pg-promise";
import { SocoboUser, Recipe, DbError, ERRORS } from "./../../models/index";
import { ErrorUtils } from "./../../logic/utils/index";


export class UserService {
  
  constructor (private _db: IDatabase<any>) {}

  getAll (): Promise<SocoboUser[]> {
    let query: string = `
        SELECT
            id, username, email, image, hasTermsAccepted,
            isAdmin, provider, created, lastModified
        FROM Socobo_User`;
    return this._db.many(query).catch(error => {
      return ErrorUtils.handleDbError(
        error, 
        UserService.name, 
        "save(..)"
      )
    });
  }

  getUserById (id: number): Promise<SocoboUser> {
    let query: string = `
        SELECT
            id, username, email, image, hasTermsAccepted,
            isAdmin, provider, created, lastModified
        FROM Socobo_User
        WHERE id=$1`;
    return this._db.one(query, id).catch(error => {
      console.log("user errro", error);
      return ErrorUtils.handleDbNotFound(
        error, 
        "id", 
        id.toString(),
        UserService.name, 
        "getUserByUsername(..)");
    });
  }

  getUserByEmail (email: string): Promise<SocoboUser> {
    let query: string = "SELECT * FROM Socobo_User Where email=$1";
    return this._db.one(query, email).catch(error => {
      return ErrorUtils.handleDbNotFound(
        error, 
        "email", 
        email, 
        UserService.name, 
        "getUserByUsername(..)");
    });
  }

  getUserByUsername (username: string): Promise<SocoboUser> {
    let query: string = "SELECT * FROM Socobo_User Where username=$1";
    return this._db.one(query, username).catch(error => {
      return ErrorUtils.handleDbNotFound(
        error, 
        "username", 
        username, 
        UserService.name, 
        "getUserByUsername(..)");
    });
  }

  save (user: SocoboUser): Promise<Object> {
    let query: string = `
      INSERT INTO Socobo_User 
        (username, email, password, image, hasTermsAccepted, 
         isAdmin, provider, created, lastModified) 
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id`;

    return this._db.tx(() => {
      return this._db.one(query, [user.username, user.email, user.password, 
                                  user.image, user.hasTermsAccepted, user.isAdmin, 
                                  user.provider, user.created, user.lastModified]);
    }).catch(error => {
      return ErrorUtils.handleDbError(
        error, 
        UserService.name, 
        "save(..)"
      )
    });
  }
}
