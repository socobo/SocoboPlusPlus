import { IDatabase } from "pg-promise";
import { ErrorUtils } from "./../../logic/utils/index";
import { DbError, ERRORS, Recipe, SocoboUser } from "./../../models/index";
import { DbExtensions } from "./../../models/index";

export class UserRepository {

  private _db: IDatabase<DbExtensions>&DbExtensions;

  constructor (db: any) {
    this._db = db;
  }

  public getAll = (): Promise<SocoboUser[]> => {
    const query: string = `
        SELECT
            id, username, email, image, hasTermsAccepted,
            role, provider, created, lastModified
        FROM Socobo_User`;
    return this._db.many(query, [])
      .then((result: Object[]) => {
        const transformedResult: SocoboUser[] = result.map(this._transformResult);
        return transformedResult;
      })
      .catch((error: any) => {
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
    return this._db.one(query, id, this._transformResult).catch((error: any) => {
      return ErrorUtils.handleDbNotFound(
        ERRORS.USER_NOT_FOUND, error, "id", id.toString(),
        UserRepository.name, "getUserById(..)");
      }
    );
  }

  public getUserByEmail = (email: string): Promise<SocoboUser> => {
    const query: string = "SELECT * FROM Socobo_User Where email=$1";
    return this._db.one(query, email, this._transformResult).catch((error: any) => {
      return ErrorUtils.handleDbNotFound(
        ERRORS.USER_NOT_FOUND, error, "email", email,
        UserRepository.name, "getUserByUsername(..)");
      }
    );
  }

  public getUserByUsername = (username: string): Promise<SocoboUser> => {
    const query: string = "SELECT * FROM Socobo_User Where username=$1";
    return this._db.one(query, username, this._transformResult).catch((error: any) => {
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

  private _transformResult = (result: any): SocoboUser => {
    const tranformedResult: SocoboUser = new SocoboUser()
      .addId(result.hasOwnProperty("id") ? Number(result.id) : null)
      .addUsername(result.hasOwnProperty("username") ? result.username : null)
      .addEmail(result.hasOwnProperty("email") ? result.email : null)
      .addPassword(result.hasOwnProperty("password") ? result.password : null)
      .addImage(result.hasOwnProperty("image") ? result.image : null)
      .addHasTermsAccepted(result.hasOwnProperty("hastermsaccepted") ? Boolean(result.hastermsaccepted) : null)
      .addRole(result.hasOwnProperty("role") ? Number(result.role) : null)
      .addProvider(result.hasOwnProperty("provider") ? Number(result.provider) : null)
      .addCreated(result.hasOwnProperty("created") ? Number(result.created) : null)
      .addLastModified(result.hasOwnProperty("lastmodified") ? Number(result.lastmodified) : null);
    return tranformedResult;
  }
}
