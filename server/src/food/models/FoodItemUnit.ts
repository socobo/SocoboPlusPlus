import { Types } from "mongoose";
import { Validatable } from "../../app/index";
import { FoodItemBase } from "./FoodItemBase";

export class FoodItemUnit extends FoodItemBase implements Validatable {

  public clone = (foodItemUnit: FoodItemUnit): this => {
    if (!foodItemUnit) {
      return undefined;
    }
    this.name = foodItemUnit.name;
    this.createDates();
    return this;
  }
}
