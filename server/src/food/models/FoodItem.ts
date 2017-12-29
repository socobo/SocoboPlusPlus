import { IsMongoId, IsNotEmpty, MinDate, MinLength } from "class-validator";
import { Types } from "mongoose";
import { Validatable, ValidationGroup } from "../../app/index";

export class FoodItem implements Validatable {

  @IsMongoId({
    groups: [ ValidationGroup.FOODITEM ]
  })
  public id: Types.ObjectId;

  @MinLength(1, {
    groups: [ ValidationGroup.FOODITEM ]
  })
  public amount: number;

  @IsNotEmpty({
    groups: [ ValidationGroup.FOODITEM ]
  })
  @MinDate(this.created, {
    groups: [ ValidationGroup.FOODITEM ]
  })
  public bestBefore: number;

  @IsNotEmpty({
    groups: [ ValidationGroup.FOODITEM ]
  })
  public created: number;

  @IsNotEmpty({
    groups: [ ValidationGroup.FOODITEM ]
  })
  @IsMongoId({
    groups: [ ValidationGroup.FOODITEM ]
  })
  public foodItemTemplateId: Types.ObjectId;

  @IsNotEmpty({
    groups: [ ValidationGroup.FOODITEM ]
  })
  @MinDate(this.created, {
    groups: [ ValidationGroup.FOODITEM ]
  })
  public lastModified: number;

  @IsNotEmpty({
    groups: [ ValidationGroup.FOODITEM ]
  })
  @IsMongoId({
    groups: [ ValidationGroup.FOODITEM ]
  })
  public socoboUserId: Types.ObjectId;

  public setId = (id: Types.ObjectId): this => {
    this.id = id;
    return this;
  }

  public setFoodItemTemplateId = (foodItemTemplateId: Types.ObjectId): this => {
    this.foodItemTemplateId = foodItemTemplateId;
    return this;
  }

  public setSocoboUserId = (socoboUserId: Types.ObjectId): this => {
    this.socoboUserId = socoboUserId;
    return this;
  }

  public setAmount = (amount: number): this => {
    this.amount = amount;
    return this;
  }

  public setBestBefore = (bestBefore: number): this => {
    this.bestBefore = bestBefore;
    return this;
  }

  public setCreated = (created: number): this => {
    this.created = created;
    return this;
  }

  public setLastModified = (lastModified: number): this => {
    this.lastModified = lastModified;
    return this;
  }

  public createDates = (): this => {
    const now = Date.now();
    this.created = now;
    this.lastModified = now;
    return this;
  }

  public clone = (foodItem: FoodItem): this => {
    this.foodItemTemplateId = foodItem.foodItemTemplateId;
    this.socoboUserId = foodItem.socoboUserId;
    this.amount = foodItem.amount;
    this.bestBefore = foodItem.bestBefore;
    this.createDates();
    return this;
  }
}
