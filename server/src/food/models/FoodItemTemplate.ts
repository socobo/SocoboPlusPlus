import { ArrayMinSize, IsMongoId, IsNotEmpty, MinLength } from "class-validator";
import { Types } from "mongoose";
import { Validatable, ValidationGroup } from "../../app/index";
import { FoodItemBase, FoodItemCategory, FoodItemUnit } from "../index";

export class FoodItemTemplate extends FoodItemBase implements Validatable {

  @ArrayMinSize(1, {
    groups: [ ValidationGroup.FOODITEMBASE ]
  })
  @IsMongoId({
    each: true,
    groups: [ ValidationGroup.FOODITEMBASE ]
  })
  public categoryIds: Types.ObjectId[];
  public categories?: FoodItemCategory[];

  @IsMongoId({
    groups: [ ValidationGroup.FOODITEMBASE ]
  })
  public unitId: Types.ObjectId;
  public unit?: FoodItemUnit;

  public setCategoryIds = (categoryIds: Types.ObjectId[]): this => {
    this.categoryIds = categoryIds;
    return this;
  }

  public setUnitId = (unitId: Types.ObjectId): this => {
    this.unitId = unitId;
    return this;
  }

  public clone = (foodItemTemplate: FoodItemTemplate): this => {
    if (!foodItemTemplate) {
      return undefined;
    }
    this._id = foodItemTemplate._id ? foodItemTemplate._id : undefined;
    this.categoryIds = [...foodItemTemplate.categoryIds],
    this.unitId = foodItemTemplate.unitId,
    this.name = foodItemTemplate.name;
    this.createDates();
    return this;
  }
}
