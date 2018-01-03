import { Document, Model, Types } from "mongoose";
import { DbError, ErrorUtils } from "../../app/index";
import { FoodItem } from "../index";
import { BaseRepository } from "./Base.repository";

export class FoodItemRepository extends BaseRepository <FoodItem> {

  constructor (private _fooditemModel: Model<Document & FoodItem>) {
    super(_fooditemModel, FoodItemRepository.name);
    this.transformFunction = this._transformResult;
  }

  public getAllBySocoboUserId = async (userId: string): Promise<FoodItem[] | DbError> => {
    try {
      const entities = await this.getAll() as FoodItem[];
      return entities.filter((entry: FoodItem) => entry.socoboUserId.toHexString() === userId);
    } catch (error) {
      return ErrorUtils.handleDbError(error, FoodItemRepository.name, "getAllBySocoboUserId(..)");
    }
  }

  private _transformResult = (result: Document & FoodItem): FoodItem => {
    if (!result) { throw new Error("FoodItem not found!"); }
    const transformedResult = new FoodItem()
      .setId(result.id)
      .setFoodItemTemplateId(result.foodItemTemplateId)
      .setSocoboUserId(result.socoboUserId)
      .setAmount(result.amount)
      .setBestBefore(result.bestBefore)
      .setCreated(result.created)
      .setLastModified(result.lastModified);
    return transformedResult;
  }
}
