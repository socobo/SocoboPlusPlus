import { SocoboUserRole } from "../models/SocoboUserRole";
import { BaseRepository } from "../../app/index";

export class SocoboUserRoleRepository extends BaseRepository <SocoboUserRole> {

  constructor (db: any) {
    super(db, "Socobo_User_Role", "name");
    this.transformFunction = this._transformResult;
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
