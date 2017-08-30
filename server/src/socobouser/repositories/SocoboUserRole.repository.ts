import { BaseRepository } from "../../app/index";
import { SocoboUserRole } from "../models/SocoboUserRole";

// TODO: remove this class --> now integrated into socobouser collection
export class SocoboUserRoleRepository extends BaseRepository <SocoboUserRole> {

  constructor (db: any) {
    super(db, "Socobo_User_Role", "name");
    this.transformFunction = this._transformResult;
  }

  private _transformResult = (result: any): SocoboUserRole => {
    const tranformedResult: SocoboUserRole = new SocoboUserRole()
      .setId(result.hasOwnProperty("id") ? Number(result.id) : null)
      .setName(result.hasOwnProperty("name") ? result.name : null)
      .setCreated(result.hasOwnProperty("created") ? Number(result.created) : null)
      .setLastModified(result.hasOwnProperty("lastmodified") ? Number(result.lastmodified) : null);
    return tranformedResult;
  }
}
