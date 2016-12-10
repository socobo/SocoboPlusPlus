import { IDatabase } from "pg-promise";
import { SocoboUser } from "./../../models/socobouser";


export class UserService {
  constructor (private _db: IDatabase<any>) {}

  getAllUsers (): Promise<SocoboUser[]> {
      return this._db.many("SELECT * FROM Socobo_User");
  }

  getUserById (id: number): Promise<SocoboUser> {
      return this._db.one("SELECT * FROM Socobo_User WHERE id=$1", id);
  }
}