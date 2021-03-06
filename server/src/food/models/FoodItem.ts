import { IsNotEmpty, Min } from "class-validator";
import { Types } from "mongoose";
import { Validatable, ValidationGroup } from "../../app/index";
import { SocoboUser } from "../../socobouser/index";
import { FoodItemTemplate } from "../index";

export class FoodItem implements Validatable {

  private _id: Types.ObjectId;
  public id: Types.ObjectId;

  @Min(1, {
    groups: [ ValidationGroup.FOODITEM ]
  })
  public amount: number;

  @IsNotEmpty({
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
  public foodItemTemplateId: Types.ObjectId;
  public foodItemTemplate?: FoodItemTemplate;

  @IsNotEmpty({
    groups: [ ValidationGroup.FOODITEM ]
  })
  public lastModified: number;

  @IsNotEmpty({
    groups: [ ValidationGroup.FOODITEM ]
  })
  public socoboUserId: Types.ObjectId;
  public socoboUser?: SocoboUser;

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
    if (!foodItem) {
      return undefined;
    }
    this._id = foodItem._id ? foodItem._id : undefined;
    this.foodItemTemplateId = new Types.ObjectId(foodItem.foodItemTemplateId);
    this.socoboUserId = new Types.ObjectId(foodItem.socoboUserId);
    this.amount = foodItem.amount;
    this.bestBefore = foodItem.bestBefore;
    this.createDates();
    return this;
  }
}
