import { IDatabase } from "pg-promise";
import { ErrorUtils } from "./../../logic/utils/index";
import { DbError, ERRORS, Recipe, SocoboUser } from "./../../models/index";

export class UserRepository {

  constructor (private _db: any) {}

  public getAll = (): Promise<SocoboUser[]> => {
    const query: string = `
        SELECT
            id, username, email, image, hasTermsAccepted,
            role, provider, created, lastModified
        FROM Socobo_User`;
    return this._db.many(query).catch((error: any) => {
      return ErrorUtils.handleDbError(error, UserRepository.name, "save(..)");
    });
  }

  public getUserById = (id: number): Promise<SocoboUser> => {
    const query: string = `
        SELECT
            id, username, email, image, hasTermsAccepted,
            role, provider, created, lastModified
        FROM Socobo_User
        WHERE id=$1`;
    return this._db.one(query, id).catch((error: any) => {
      return ErrorUtils.handleDbNotFound(
        ERRORS.USER_NOT_FOUND, error, "id", id.toString(),
        UserRepository.name, "getUserById(..)");
      }
    );
  }

  public getUserByEmail = (email: string): Promise<SocoboUser> => {
    const query: string = "SELECT * FROM Socobo_User Where email=$1";
    return this._db.one(query, email).catch((error: any) => {
      return ErrorUtils.handleDbNotFound(
        ERRORS.USER_NOT_FOUND, error, "email", email,
        UserRepository.name, "getUserByUsername(..)");
      }
    );
  }

  public getUserByUsername = (username: string): Promise<SocoboUser> => {
    const query: string = "SELECT * FROM Socobo_User Where username=$1";
    return this._db.one(query, username).catch((error: any) => {
      return ErrorUtils.handleDbNotFound(
        ERRORS.USER_NOT_FOUND, error, "username", username,
        UserRepository.name, "getUserByUsername(..)");
      }
    );
  }

  public save = (user: SocoboUser): Promise<Object> => {
    const query: string = `
      INSERT INTO Socobo_User
        (username, email, password, image, hasTermsAccepted,
         role, provider, created, lastModified)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id`;
    return this._db.tx("SaveUser", () => {
      return this._db.one(query, [user.username, user.email, user.password,
                                  user.image, user.hasTermsAccepted, user.role,
                                  user.provider, user.created, user.lastModified]);
    }).catch((error: any) => {
      return ErrorUtils.handleDbError(error, UserRepository.name, "save(..)");
    });
  }
}
