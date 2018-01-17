import { IsNotEmpty } from "class-validator";
import { Types } from "mongoose";
import { ValidationGroup } from "../../app/index";

export class FoodItemBase {

  protected _id: Types.ObjectId;
  public id: Types.ObjectId;

  @IsNotEmpty({
    groups: [ ValidationGroup.FOODITEMBASE ]
  })
  public name: string;

  @IsNotEmpty({
    groups: [ ValidationGroup.FOODITEMBASE ]
  })
  public created: number;

  @IsNotEmpty({
    groups: [ ValidationGroup.FOODITEMBASE ]
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

  public createDates = (): this => {
    const now = Date.now();
    this.created = now;
    this.lastModified = now;
    return this;
  }
}
