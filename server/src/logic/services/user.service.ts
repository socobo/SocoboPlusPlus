import { IDatabase } from "pg-promise";
import { SocoboUser } from "./../../models/socobouser";


export class UserService {
  private _db: IDatabase<any>;

  constructor (db: IDatabase<any>) {
    this._db = db;
  }

  getAllUsers (): Promise<SocoboUser[]> {
    return new Promise((resolve, reject) => {
      this._db.many("SELECT * FROM Socobo_User")
        .then((result: SocoboUser[]) => resolve(result))
        .catch((error: any) => reject(error));
    });
  }

  getUserById (id: number): Promise<SocoboUser> {
    return new Promise ((resolve, reject) => {
      this._db.one("SELECT * FROM Socobo_User WHERE id=$1", id)
        .then((result: SocoboUser) => resolve(result))
        .catch((error: any) => reject(error));
    });
  }
}