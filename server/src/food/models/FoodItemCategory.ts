import { Types } from "mongoose";
import { Validatable } from "../../app/index";
import { FoodItemBase } from "./FoodItemBase";

export class FoodItemCategory extends FoodItemBase implements Validatable {

  public clone = (foodItemCategory: FoodItemCategory): this => {
    if (!foodItemCategory) {
      return undefined;
    }
    this._id = foodItemCategory._id ? foodItemCategory._id : undefined;
    this.name = foodItemCategory.name;
    this.createDates();
    return this;
  }
}
