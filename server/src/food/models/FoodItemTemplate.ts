import { IsNotEmpty, MinLength } from "class-validator";
import { Types } from "mongoose";
import { Validatable, ValidationGroup } from "../../app/index";

export class FoodItemTemplate implements Validatable {

  public id: Types.ObjectId;

  @IsNotEmpty({
    groups: [ ValidationGroup.FOODITEMTEMPLATE ]
  })
  @MinLength(2, {
    groups: [ ValidationGroup.FOODITEMTEMPLATE ]
  })
  public name: string;

  @IsNotEmpty({
    groups: [ ValidationGroup.FOODITEMTEMPLATE ]
  })
  public created: number;

  @IsNotEmpty({
    groups: [ ValidationGroup.FOODITEMTEMPLATE ]
  })
  public lastModified: number;

  public setId = (id: Types.ObjectId): this => {
    this.id = id;
    return this;
  }

  public setName = (name: string): this => {
    this.name = name;
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

  public clone = (foodItemTemplate: FoodItemTemplate): this => {
    this.name = foodItemTemplate.name;
    this.createDates();
    return this;
  }

  public createDates = (): this => {
    const now = Date.now();
    this.created = now;
    this.lastModified = now;
    return this;
  }
}
