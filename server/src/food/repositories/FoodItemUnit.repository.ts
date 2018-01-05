import { Document, Model, Types } from "mongoose";
import { ApiError, DbError, ERRORS, ErrorUtils } from "../../app/index";
import { BaseRepository, FoodItemUnit } from "../index";

export class FoodItemUnitRepository extends BaseRepository <FoodItemUnit> {

  constructor (private _fooditemUnitModel: Model<Document & FoodItemUnit>) {
    super(_fooditemUnitModel, FoodItemUnitRepository.name);
    this.transformFunction = this._transformResult;
  }

  private _transformResult = (result: Document & FoodItemUnit): FoodItemUnit => {
    if (!result) { throw new ApiError(ERRORS.FOODITEMTUNIT_NOT_FOUND)
      .addSource(FoodItemUnitRepository.name)
      .addSourceMethod("_transformResult");
    }
    const transformedResult = new FoodItemUnit()
      .setId(new Types.ObjectId(result.id))
      .setFoodItemId(new Types.ObjectId(result.foodItemId))
      .setName(result.name)
      .setCreated(result.created)
      .setLastModified(result.lastModified);
    return transformedResult;
  }
}
