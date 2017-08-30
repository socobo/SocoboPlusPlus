import { BaseRepository } from "../../app/index";
import { SocoboUserImage } from "../models/SocoboUserImage";

// TODO: remove this class --> now integrated into socobouser collection
export class SocoboUserImageRepository extends BaseRepository <SocoboUserImage> {

  constructor (db: any) {
    super(db, "Socobo_User_Image", "url");
    this.transformFunction = this._transformResult;
  }

  private _transformResult = (result: any): SocoboUserImage => {
    const tranformedResult: SocoboUserImage = new SocoboUserImage()
      .setId(result.hasOwnProperty("id") ? Number(result.id) : null)
      .setUrl(result.hasOwnProperty("url") ? result.url : null)
      .setCreated(result.hasOwnProperty("created") ? Number(result.created) : null)
      .setLastModified(result.hasOwnProperty("lastmodified") ? Number(result.lastmodified) : null);
    return tranformedResult;
  }
}
