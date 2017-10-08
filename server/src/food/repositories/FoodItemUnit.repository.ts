import { Document, Model, Types } from "mongoose";
import { DbError, ERRORS, ErrorUtils } from "../../app/index";
import { FoodItemUnit } from "../index";

export class FoodItemUnitRepository {

  constructor (private _fooditemUnitModel: Model<Document & FoodItemUnit>) {}

  public getAll = async (): Promise<FoodItemUnit[] | DbError> => {
    try {
      const units = await this._fooditemUnitModel.find({});
      return units.map(this._transformResult);
    } catch (error) {
      return ErrorUtils.handleDbError(error, FoodItemUnitRepository.name, "getAll(..)");
    }
  }

  public getAllByFooditemId = async (foodItemId: Types.ObjectId): Promise<FoodItemUnit[] | DbError> => {
    try {
      const units = await this._fooditemUnitModel.find({ foodItemId });
      return units.map(this._transformResult);
    } catch (error) {
      return ErrorUtils.handleDbError(error, FoodItemUnitRepository.name, "getAllByFooditemId(..)");
    }
  }

  public getById = async (id: Types.ObjectId): Promise<FoodItemUnit | DbError> => {
    try {
      const unit = await this._fooditemUnitModel.findOne({_id: id});
      return this._transformResult(unit);
    } catch (error) {
      return ErrorUtils.handleDbNotFound(ERRORS.FOODITEMTUNIT_NOT_FOUND, error,
        FoodItemUnitRepository.name, "getById(..)", "id", id.toString());
    }
  }

  public save = async (unit: FoodItemUnit): Promise<Types.ObjectId | DbError> => {
    try {
      const createdUnit = await this._fooditemUnitModel.create(unit);
      return createdUnit._id;
    } catch (error) {
      return ErrorUtils.handleDbError(error, FoodItemUnitRepository.name, "save(..)");
    }
  }

  public updateById = async (id: Types.ObjectId, name: string): Promise<FoodItemUnit | DbError> => {
    try {
      const updateValues = { name, lastModified: Date.now() };
      const updatedUnit = await this._fooditemUnitModel.findByIdAndUpdate({ _id: id},
                                                                          { $set: updateValues },
                                                                          { new: true });
      return this._transformResult(updatedUnit);
    } catch (error) {
      return ErrorUtils.handleDbError(error, FoodItemUnitRepository.name, "updateById(..)");
    }
  }

  public deleteById = async (id: Types.ObjectId): Promise<object | DbError> => {
    try {
      await this._fooditemUnitModel.findByIdAndRemove({_id: id});
      return { id };
    } catch (error) {
      return ErrorUtils.handleDbError(error, FoodItemUnitRepository.name, "deleteById(..)");
    }
  }

  private _transformResult = (result: Document & FoodItemUnit): FoodItemUnit => {
    if (!result) { throw new Error("FoodItemUnit not found!"); }
    const transformedResult = new FoodItemUnit()
      .setId(new Types.ObjectId(result.id))
      .setFoodItemId(new Types.ObjectId(result.foodItemId))
      .setName(result.name)
      .setCreated(result.created)
      .setLastModified(result.lastModified);
    return transformedResult;
  }
}
