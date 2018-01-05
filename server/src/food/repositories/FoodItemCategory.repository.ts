import { Document, Model, Types } from "mongoose";
import { FoodItemCategory } from "../index";
import { BaseRepository } from "./Base.repository";
import { ApiError, ERRORS } from "../../app/index";

export class FoodItemCategoryRepository extends BaseRepository <FoodItemCategory> {

  constructor (private _fooditemCategoryModel: Model<Document & FoodItemCategory>) {
    super(_fooditemCategoryModel, FoodItemCategoryRepository.name);
    this.transformFunction = this._transformResult;
  }

  private _transformResult = (result: Document & FoodItemCategory): FoodItemCategory => {
    if (!result) { throw new ApiError(ERRORS.FOODITEMCATEGORY_NOT_FOUND)
      .addSource(FoodItemCategoryRepository.name)
      .addSourceMethod('_transformResult');
    }
    const transformedResult = new FoodItemCategory()
      .setId(new Types.ObjectId(result.id))
      .setFoodItemId(new Types.ObjectId(result.foodItemId))
      .setName(result.name)
      .setCreated(result.created)
      .setLastModified(result.lastModified);
    return transformedResult;
  }
}
