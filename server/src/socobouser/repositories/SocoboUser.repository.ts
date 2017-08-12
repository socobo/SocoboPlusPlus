import { IDatabase } from "pg-promise";
import { DbError, DbExtensions, ERRORS, ErrorUtils } from "../../app/index";
import { SocoboUserUpdateTypes } from "../enums/SocoboUserUpdateTypes";
import { SocoboUser } from "../models/SocoboUser";

export class SocoboUserRepository {

  private _db: IDatabase<DbExtensions>&DbExtensions;

  constructor (db: any) {
    this._db = db;
  }

  public getAll = (): Promise<SocoboUser[] | DbError> => {
    const query: string = `
        SELECT
          id, socoboUserRoleId, socoboUserProviderId, socoboUserImageId, 
          username, email, hasTermsAccepted, created, lastModified
        FROM Socobo_User
        ORDER BY id`;
    return this._db.many(query, [])
      .then((result: Object[]) => result.map(this._transformResult))
      .catch((error: any) => ErrorUtils.handleDbError(error, SocoboUserRepository.name, "getAll(..)"));
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
        ERRORS.USER_NOT_FOUND, error, SocoboUserRepository.name, "getUserById(..)", "id", id.toString());
      }
    );
  }

  public getUserByEmail = (email: string): Promise<SocoboUser> => {
    const query: string = "SELECT * FROM Socobo_User Where email=$1";
    return this._db.one(query, email, this._transformResult).catch((error: any) => {
      return ErrorUtils.handleDbNotFound (
        ERRORS.USER_NOT_FOUND, error, SocoboUserRepository.name, "getUserByEmail(..)", "email", email);
      }
    );
  }

  public getUserByUsername = (username: string): Promise<SocoboUser> => {
    const query: string = "SELECT * FROM Socobo_User Where username=$1";
    return this._db.one(query, username, this._transformResult).catch((error: any) => {
      return ErrorUtils.handleDbNotFound(
        ERRORS.USER_NOT_FOUND, error, SocoboUserRepository.name, "getUserByUsername(..)", "username", username);
      }
    );
  }

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
        return ErrorUtils.handleDbError(error, SocoboUserRepository.name, "save(..)");
      });
  }

  public updateById = (id: number, updateType: SocoboUserUpdateTypes,
                       fieldValuesToUpdate: string[]): Promise<SocoboUser> => {
    const query: string = this._getUpdateQuery(updateType);
    const fields: any[] = [id, ...fieldValuesToUpdate, Date.now()];
    return this._db.tx("UpdateUser", () => {
      return this._db.one(query, fields)
        .then((result: any) => this.getUserById(result.id))
        .catch((error: any) => {
          return ErrorUtils.handleDbError(error, SocoboUserRepository.name, "updateById(..)");
        });
    });
  }

  public deleteById = (id: number): Promise<Object> => {
    const query: string = `DELETE FROM Socobo_User WHERE id=$1 RETURNING id`;
    return this._db.tx("DeleteUser", () => this._db.one(query, [id]))
      .catch((error: any) => ErrorUtils.handleDbError(error, SocoboUserRepository.name, "deleteById(..)"));
  }

  private _transformResult = (result: any): SocoboUser => {
    const tranformedResult: SocoboUser = new SocoboUser()
      .setId(result.hasOwnProperty("id") ? Number(result.id) : null)
      .setSocoboUserRoleId(result.hasOwnProperty("socobouserroleid") ?
          Number(result.socobouserroleid) : null)
      .setSocoboUserProviderId(result.hasOwnProperty("socobouserproviderid") ?
          Number(result.socobouserproviderid) : null)
      .setSocoboUserImageId(result.hasOwnProperty("socobouserimageid") ?
          Number(result.socobouserimageid) : null)
      .setUsername(result.hasOwnProperty("username") ? result.username : null)
      .setEmail(result.hasOwnProperty("email") ? result.email : null)
      .setPassword(result.hasOwnProperty("password") ? result.password : null)
      .setHasTermsAccepted(result.hasOwnProperty("hastermsaccepted") ? Boolean(result.hastermsaccepted) : null)
      .setCreated(result.hasOwnProperty("created") ? Number(result.created) : null)
      .setLastModified(result.hasOwnProperty("lastmodified") ? Number(result.lastmodified) : null);
    return tranformedResult;
  }

  private _getUpdateQuery = (updateType: SocoboUserUpdateTypes): string => {
    let result: string = "UPDATE Socobo_User";

    switch (updateType) {
      case SocoboUserUpdateTypes.full:
        result += ` SET username=$2, email=$3, password=$4, lastModified=$5`;
        break;

      case SocoboUserUpdateTypes.username:
        result += ` SET username=$2, lastModified=$3`;
        break;

      case SocoboUserUpdateTypes.email:
        result += ` SET email=$2, lastModified=$3`;
        break;

      case SocoboUserUpdateTypes.password:
        result += ` SET password=$2, lastModified=$3`;
        break;

      case SocoboUserUpdateTypes.image:
        result += ` SET socoboUserImageId=$2, lastModified=$3`;
        break;

      case SocoboUserUpdateTypes.role:
        result += ` SET socoboUserRoleId=$2, lastModified=$3`;
        break;

      case SocoboUserUpdateTypes.provider:
        result += ` SET socoboUserProviderId=$2, lastModified=$3`;
        break;

      default:
        throw new Error("Invalid UpdateType");
    }

    result += ` WHERE id=$1 RETURNING id`;

    return result;
  }
}
