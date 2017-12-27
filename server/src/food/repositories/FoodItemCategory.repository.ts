import { Document, Model, Types } from "mongoose";
import { FoodItemCategory } from "../index";
import { BaseRepository } from "./Base.repository";

export class FoodItemCategoryRepository extends BaseRepository <FoodItemCategory> {

  constructor (private _fooditemCategoryModel: Model<Document & FoodItemCategory>) {
    super(_fooditemCategoryModel, FoodItemCategoryRepository.name);
    this.transformFunction = this._transformResult;
  }

  private _transformResult = (result: Document & FoodItemCategory): FoodItemCategory => {
    if (!result) { throw new Error("FoodItemCategory not found!"); }
    const transformedResult = new FoodItemCategory()
      .setId(new Types.ObjectId(result.id))
      .setFoodItemId(new Types.ObjectId(result.foodItemId))
      .setName(result.name)
      .setCreated(result.created)
      .setLastModified(result.lastModified);
    return transformedResult;
  }
}
