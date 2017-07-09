import { IDatabase } from "pg-promise";
import { ErrorUtils } from "./../../logic/utils/index";
import { DbError, ERRORS, Recipe, SocoboUser, UpdateType } from "./../../models/index";
import { DbExtensions } from "./../../models/index";

export class UserRepository {

  private _db: IDatabase<DbExtensions>&DbExtensions;

  constructor (db: any) {
    this._db = db;
  }

  public getAll = (): Promise<SocoboUser[]> => {
    const query: string = `
        SELECT
          id, socoboUserRoleId, socoboUserProviderId, socoboUserImageId, 
          username, email, hasTermsAccepted, created, lastModified
        FROM Socobo_User
        ORDER BY id`;
    return this._db.many(query, [])
      .then((result: Object[]) => {
        const transformedResult: SocoboUser[] = result.map(this._transformResult);
        return transformedResult;
      })
      .catch((error: any) => {
        return ErrorUtils.handleDbError(error, UserRepository.name, "getAll(..)");
      });
  }

  public getUserById = (id: number): Promise<SocoboUser> => {
    const query: string = `
        SELECT
          id, socoboUserRoleId, socoboUserProviderId, socoboUserImageId, 
          username, email, hasTermsAccepted, created, lastModified
        FROM Socobo_User
        WHERE id=$1`;
    return this._db.one(query, id, this._transformResult).catch((error: any) => {
      return ErrorUtils.handleDbNotFound(
        ERRORS.USER_NOT_FOUND, error, UserRepository.name,
        "getUserById(..)", "id", id.toString());
      }
    );
  }

  public getUserByEmail = (email: string): Promise<SocoboUser> => {
    const query: string = "SELECT * FROM Socobo_User Where email=$1";
    return this._db.one(query, email, this._transformResult).catch((error: any) => {
      return ErrorUtils.handleDbNotFound (
        ERRORS.USER_NOT_FOUND, error, UserRepository.name,
        "getUserByEmail(..)", "email", email);
      }
    );
  }

  public getUserByUsername = (username: string): Promise<SocoboUser> => {
    const query: string = "SELECT * FROM Socobo_User Where username=$1";
    return this._db.one(query, username, this._transformResult).catch((error: any) => {
      return ErrorUtils.handleDbNotFound(
        ERRORS.USER_NOT_FOUND, error, UserRepository.name,
        "getUserByUsername(..)", "username", username);
      }
    );
  }

  /**
   * ToDo: 
   *  - IMAGE, ROLE & Provider
   *  -- Insert image, role, provider first, after this update User with Image id
   */
  public save = (user: SocoboUser): Promise<Object> => {
    const query: string = `
      INSERT INTO Socobo_User
        (username, email, password, hasTermsAccepted, created, lastModified)
      VALUES
        ($1, $2, $3, $4, $5, $6)
      RETURNING id`;
    return this._db.tx("SaveUser", () => {
      return this._db.one(query, [user.username, user.email, user.password,
                                  user.hasTermsAccepted, user.created, user.lastModified]);
      }).catch((error: any) => {
        return ErrorUtils.handleDbError(error, UserRepository.name, "save(..)");
      });
  }

  public updateById = (id: number, updateType: UpdateType, fieldValuesToUpdate: string[]): Promise<SocoboUser> => {
    const query: string = this._getUpdateQuery(updateType);
    const fields: any[] = [id, ...fieldValuesToUpdate, Date.now()];
    return this._db.tx("UpdateUser", () => {
      return this._db.one(query, fields)
        .then((result: any) => this.getUserById(result.id))
        .catch((error: any) => {
          return ErrorUtils.handleDbError(error, UserRepository.name, "updateById(..)");
        });
    });
  }

  public deleteById = (id: number): Promise<Object> => {
    const query: string = `DELETE FROM Socobo_User WHERE id=$1 RETURNING id`;
    return this._db.tx("DeleteUser", () => this._db.one(query, [id]))
      .catch((error: any) => ErrorUtils.handleDbError(error, UserRepository.name, "deleteById(..)"));
  }

  private _transformResult = (result: any): SocoboUser => {
    const tranformedResult: SocoboUser = new SocoboUser()
      .addId(result.hasOwnProperty("id") ? Number(result.id) : null)
      .addSocoboUserRoleId(result.hasOwnProperty("socoboUserRoleId") ? Number(result.socoboUserRoleId) : null)
      .addSocoboUserProviderId(result.hasOwnProperty("socoboUserProviderId") ? Number(result.socoboUserProviderId) : null)
      .addSocoboUserImageId(result.hasOwnProperty("socoboUserImageId") ? Number(result.socoboUserImageId) : null)
      .addUsername(result.hasOwnProperty("username") ? result.username : null)
      .addEmail(result.hasOwnProperty("email") ? result.email : null)
      .addPassword(result.hasOwnProperty("password") ? result.password : null)
      .addHasTermsAccepted(result.hasOwnProperty("hastermsaccepted") ? Boolean(result.hastermsaccepted) : null)
      .addCreated(result.hasOwnProperty("created") ? Number(result.created) : null)
      .addLastModified(result.hasOwnProperty("lastmodified") ? Number(result.lastmodified) : null);
    return tranformedResult;
  }

  /**
   * ToDo: 
   *  - IMAGE, ROLE & Provider
   *  -- Insert image, role, provider first, after this update User with Image id
   */
  private _getUpdateQuery = (updateType: UpdateType): string => {
    let result: string = "UPDATE Socobo_User";

    switch (updateType) {
      case UpdateType.full:
        result += ` SET username=$2, email=$3, password=$4, lastModified=$5`;
        break;

      case UpdateType.username:
        result += ` SET username=$2, lastModified=$3`;
        break;

      case UpdateType.email:
        result += ` SET email=$2, lastModified=$3`;
        break;

      case UpdateType.password:
        result += ` SET password=$2, lastModified=$3`;
        break;

      case UpdateType.image:
        result += ` SET socoboUserImageId=$2, lastModified=$3`;
        break;

      case UpdateType.role:
        result += ` SET socoboUserRoleId=$2, lastModified=$3`;
        break;

      case UpdateType.provider:
        result += ` SET socoboUserProviderId=$2, lastModified=$3`;
        break;

      default:
        throw new Error("Invalid UpdateType");
    }

    result += ` WHERE id=$1 RETURNING id`;

    return result;
  }
}
