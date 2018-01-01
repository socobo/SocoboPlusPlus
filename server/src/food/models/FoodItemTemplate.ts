import { IsNotEmpty, MinLength } from "class-validator";
import { Types } from "mongoose";
import { Validatable, ValidationGroup } from "../../app/index";
import { FoodItemBase } from "./FoodItemBase";

export class FoodItemTemplate extends FoodItemBase implements Validatable {

  public clone = (foodItemTemplate: FoodItemTemplate): this => {
    if (!foodItemTemplate) {
      return undefined;
    }
    this.name = foodItemTemplate.name;
    this.createDates();
    return this;
  }
}
