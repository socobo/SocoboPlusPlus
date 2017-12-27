import { Document, Model, Types } from "mongoose";
import { DbError, ERRORS, ErrorUtils } from "../../app/index";
import { BaseRepository, FoodItemTemplate } from "../index";

export class FoodItemTemplateRepository extends BaseRepository <FoodItemTemplate> {

  constructor (private _fooditemTemplateModel: Model<Document & FoodItemTemplate>) {
    super(_fooditemTemplateModel, FoodItemTemplateRepository.name);
    this.transformFunction = this._transformResult;
  }

  private _transformResult = (result: Document & FoodItemTemplate): FoodItemTemplate => {
    if (!result) { throw new Error("FoodItemTemplate not found!"); }
    const tranformedResult: FoodItemTemplate = new FoodItemTemplate()
      .setId(new Types.ObjectId(result.id))
      .setName(result.name)
      .setCreated(result.created)
      .setLastModified(result.lastModified);
    return tranformedResult;
  }
}
