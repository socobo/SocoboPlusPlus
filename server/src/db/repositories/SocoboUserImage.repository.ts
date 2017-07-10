import { SocoboUserImage } from "../../models/index";
import { BaseRepository } from "./Base.repository";

export class SocoboUserImageRepository extends BaseRepository <SocoboUserImage> {

  constructor (db: any) {
    super(db, "Socobo_User_Image", "url");
    this.transformFunction = this._transformResult;
  }

  private _transformResult = (result: any): SocoboUserImage => {
    const tranformedResult: SocoboUserImage = new SocoboUserImage()
      .addId(result.hasOwnProperty("id") ? Number(result.id) : null)
      .addUrl(result.hasOwnProperty("url") ? result.url : null)
      .addCreated(result.hasOwnProperty("created") ? Number(result.created) : null)
      .addLastModified(result.hasOwnProperty("lastmodified") ? Number(result.lastmodified) : null);
    return tranformedResult;
  }
}
