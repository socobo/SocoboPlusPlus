import { IDatabase } from "pg-promise";
import { ErrorUtils } from "../../logic/utils/index";
import { DbExtensions, ERRORS } from "../../models/index";
import { IBaseRepositiory } from "./IBase.repository";

export class BaseRepository <T> implements IBaseRepositiory <T> {

  private _db: IDatabase<DbExtensions>&DbExtensions;
  private _tableName: string;
  private _updateFieldName: string;
  private _transformFunction: any;

  constructor (db: any, tableName: string, updateFieldName: string) {
    this._db = db;
    this._tableName = tableName;
    this._updateFieldName = updateFieldName;
  }

  get transformFunction (): any {
    return this._transformFunction;
  }

  set transformFunction (func: any) {
    this._transformFunction = func;
  }

  public getAll = (): Promise<T[]> => {
    const query: string = `SELECT * FROM ${this._tableName} ORDER BY id`;
    return this._db.many(query, [])
      .then((result: Object[]) => result.map(this._transformFunction))
      .catch((error: any) => ErrorUtils.handleDbError(error, BaseRepository.name, "getAll(..)"));
  }

  public getById = (id: number): Promise<T> => {
    const query: string = `SELECT * FROM ${this._tableName} WHERE id=$1`;
    return this._db.one(query, id, this._transformFunction).catch((error: any) => {
      return ErrorUtils.handleDbNotFound(
        ERRORS.GENERIC_BASE_NOT_FOUND, error, BaseRepository.name,
        "getRoleById(..)", this._tableName, "id", id.toString());
      }
    );
  }

  public save = (entity: T): Promise<Object> => {
    const query: string = `
      INSERT INTO ${this._tableName} (name, created, lastModified)
      VALUES ($1, $2, $3)
      RETURNING id`;
    return this._db.tx("SaveBase", () => {
        return this._db.one(query, entity);
      }).catch((error: any) => {
        return ErrorUtils.handleDbError(error, BaseRepository.name, "save(..)");
      });
  }

  public updateById = (id: number, updateFieldValue: string): Promise<T> => {
    const query: string = `
      UPDATE ${this._tableName}
      SET ${this._updateFieldName}=$2 AND lastModified=$3
      WHERE id=$1 RETURNING id`;
    return this._db.tx("UpdateBase", () => {
      return this._db.one(query, [id, updateFieldValue, Date.now()])
        .then((result: any) => this.getById(result.id))
        .catch((error: any) => {
          return ErrorUtils.handleDbError(error, BaseRepository.name, "updateById(..)");
        });
    });
  }

  public deleteById = (id: number): Promise<Object> => {
    const query: string = `DELETE FROM ${this._tableName} WHERE id=$1 RETURNING id`;
    return this._db.tx("DeleteBase", () => this._db.one(query, [id]))
      .catch((error: any) => ErrorUtils.handleDbError(error, BaseRepository.name, "deleteById(..)"));
  }
}
