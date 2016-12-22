import { IDatabase } from "pg-promise";
import { SocoboUser } from "./../../models/socoboUser";


export class UserService {
  constructor (private _db: IDatabase<any>) {}

  getAllUsers (): Promise<SocoboUser[]> {
      let query: string = `
        SELECT
            id, username, email, 
            hasTermsAccepted, isAdmin, provider 
        FROM Socobo_User`;
      return this._db.many(query);
  }

  getUserById (id: number): Promise<SocoboUser> {
      let query: string = `
        SELECT
            id, username, email, 
            hasTermsAccepted, isAdmin, provider 
        FROM Socobo_User
        WHERE id=$1`;
      return this._db.one(query, id);
  }
}