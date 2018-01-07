import { Document, Model, Types } from "mongoose";
import { ApiError, DbError, ERRORS, ErrorUtils } from "../../app/index";
import { BaseRepository, FoodItemTemplate } from "../index";

export class FoodItemTemplateRepository extends BaseRepository <FoodItemTemplate> {

  constructor (private _fooditemTemplateModel: Model<Document & FoodItemTemplate>) {
    super(_fooditemTemplateModel, FoodItemTemplateRepository.name);
    this.transformFunction = this._transformResult;
  }

  private _transformResult = (result: Document & FoodItemTemplate): FoodItemTemplate => {
    if (!result) {
      throw new ApiError(ERRORS.FOODITEMTEMPLTE_NOT_FOUND.withArgs("id", "UNKNOWN"))
        .addSource(FoodItemTemplateRepository.name)
        .addSourceMethod("_transformResult(..)");
    }
    const tranformedResult: FoodItemTemplate = new FoodItemTemplate()
      .setId(new Types.ObjectId(result.id))
      .setCategoryIds(result.categoryIds)
      .setUnitId(result.unitId)
      .setName(result.name)
      .setCreated(result.created)
      .setLastModified(result.lastModified);
    return tranformedResult;
  }
}
