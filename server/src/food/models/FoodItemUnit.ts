import { Types } from "mongoose";
import { Validatable } from "../../app/index";
import { FoodItemBase } from "./FoodItemBase";

export class FoodItemUnit extends FoodItemBase implements Validatable {

  public foodItemId: Types.ObjectId;

  public setFoodItemId = (id: Types.ObjectId): this => {
    this.foodItemId = id;
    return this;
  }

  public clone = (foodItemUnit: FoodItemUnit): this => {
    this.foodItemId = foodItemUnit.foodItemId;
    this.name = foodItemUnit.name;
    this.createDates();
    return this;
  }
}
