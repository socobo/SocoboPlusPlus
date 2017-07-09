import { IDatabase } from "pg-promise";
import { ErrorUtils } from "./../../logic/utils/index";
import { DbError, ERRORS, SocoboUserRole } from "./../../models/index";
import { DbExtensions } from "./../../models/index";

export class SocoboUserRoleRepository {

  private _db: IDatabase<DbExtensions>&DbExtensions;

  constructor (db: any) {
    this._db = db;
  }

  public getAll = (): Promise<SocoboUserRole[]> => {
    const query: string = "SELECT * FROM Socobo_User_Role ORDER BY id";
    return this._db.many(query, [])
      .then((result: Object[]) => result.map(this._transformResult))
      .catch((error: any) => ErrorUtils.handleDbError(error, SocoboUserRoleRepository.name, "getAll(..)"));
  }

  public getRoleById = (id: number): Promise<SocoboUserRole> => {
    const query: string = `SELECT * FROM Socobo_User_Role WHERE id=$1`;
    return this._db.one(query, id, this._transformResult).catch((error: any) => {
      return ErrorUtils.handleDbNotFound(
        ERRORS.ROLE_NOT_FOUND, error, SocoboUserRoleRepository.name, "getRoleById(..)", "id", id.toString());
      }
    );
  }

  public save = (userRole: SocoboUserRole): Promise<Object> => {
    const query: string = `
      INSERT INTO Socobo_User_Role (name, created, lastModified)
      VALUES ($1, $2, $3)
      RETURNING id`;
    return this._db.tx("SaveUserRole", () => {
        return this._db.one(query, [userRole.name, userRole.created, userRole.lastModified]);
      }).catch((error: any) => {
        return ErrorUtils.handleDbError(error, SocoboUserRoleRepository.name, "save(..)");
      });
  }

  public updateById = (id: number, name: string): Promise<SocoboUserRole> => {
    const query: string = `
      UPDATE Socobo_User_Role
      SET name=$2 AND lastModified=$3
      WHERE id=$1 RETURNING id`;
    return this._db.tx("UpdateUserRole", () => {
      return this._db.one(query, [id, name, Date.now()])
        .then((result: any) => this.getRoleById(result.id))
        .catch((error: any) => {
          return ErrorUtils.handleDbError(error, SocoboUserRoleRepository.name, "updateById(..)");
        });
    });
  }

  public deleteById = (id: number): Promise<Object> => {
    const query: string = `DELETE FROM Socobo_User_Role WHERE id=$1 RETURNING id`;
    return this._db.tx("DeleteUserRole", () => this._db.one(query, [id]))
      .catch((error: any) => ErrorUtils.handleDbError(error, SocoboUserRoleRepository.name, "deleteById(..)"));
  }

  private _transformResult = (result: any): SocoboUserRole => {
    const tranformedResult: SocoboUserRole = new SocoboUserRole()
      .addId(result.hasOwnProperty("id") ? Number(result.id) : null)
      .addName(result.hasOwnProperty("name") ? result.name : null)
      .addCreated(result.hasOwnProperty("created") ? Number(result.created) : null)
      .addLastModified(result.hasOwnProperty("lastmodified") ? Number(result.lastmodified) : null);
    return tranformedResult;
  }
}
