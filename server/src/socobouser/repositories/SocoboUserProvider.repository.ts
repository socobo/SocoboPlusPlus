import { BaseRepository } from "../../app/index";
import { SocoboUserProvider } from "../models/SocoboUserProvider";

export class SocoboUserProviderRepository extends BaseRepository <SocoboUserProvider> {

  constructor (db: any) {
    super(db, "Socobo_User_Provider", "name");
    this.transformFunction = this._transformResult;
  }

  private _transformResult = (result: any): SocoboUserProvider => {
    const tranformedResult: SocoboUserProvider = new SocoboUserProvider()
      .setId(result.hasOwnProperty("id") ? Number(result.id) : null)
      .setName(result.hasOwnProperty("name") ? result.name : null)
      .setCreated(result.hasOwnProperty("created") ? Number(result.created) : null)
      .setLastModified(result.hasOwnProperty("lastmodified") ? Number(result.lastmodified) : null);
    return tranformedResult;
  }
}
