import { IDatabase } from "pg-promise";
import { SocoboUser } from "./../../models/index";


export class UserService {
  constructor (private _db: IDatabase<any>) {}

  getAllUsers (): Promise<SocoboUser[]> {
    let query: string = `
        SELECT
            id, username, email, image,
            hasTermsAccepted, isAdmin, provider 
        FROM Socobo_User`;
    return this._db.many(query);
  }

  getUserById (id: number): Promise<SocoboUser> {
    let query: string = `
        SELECT
            id, username, email, image,
            hasTermsAccepted, isAdmin, provider 
        FROM Socobo_User
        WHERE id=$1`;
    return this._db.one(query, id);
  }

  getUserByEmail (email: string): Promise<SocoboUser> {
    let query: string = "SELECT * FROM Socobo_User Where email=$1";
    return this._db.one(query, email);
  }

  getUserByUsername (username: string): Promise<SocoboUser> {
    let query: string = "SELECT * FROM Socobo_User Where username=$1";
    return this._db.one(query, username);
  }

  save (user: SocoboUser): Promise<Object> {
    let query: string = `
      INSERT INTO Socobo_User 
        (username, email, password, image, hasTermsAccepted, isAdmin, provider) 
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id`;
    return this._db.one(query, [user.username, user.email, user.password, 
                                user.image, user.hasTermsAccepted, 
                                user.isAdmin, user.provider]);
  }
}