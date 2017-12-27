import { Types } from "mongoose";
import { Validatable } from "../../app/index";
import { FoodItemBase } from "./FoodItemBase";

export class FoodItemCategory extends FoodItemBase implements Validatable {

  public foodItemId: Types.ObjectId;

  public setFoodItemId = (id: Types.ObjectId): this => {
    this.foodItemId = id;
    return this;
  }

  public clone = (foodItemCategory: FoodItemCategory): this => {
    this.foodItemId = foodItemCategory.foodItemId;
    this.name = foodItemCategory.name;
    this.createDates();
    return this;
  }
}
