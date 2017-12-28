import { IsInt, IsNotEmpty} from "class-validator";
import { Types } from "mongoose";

import { Validatable, ValidationGroup } from "../../app/index";
export class RecipeIngredient implements Validatable {

  public _id: Types.ObjectId | string;
  @IsNotEmpty({
    groups: [ ValidationGroup.RECIPE ]
  })
  @IsInt({
    groups: [ ValidationGroup.RECIPE ]
  })
  public amount: number;
  @IsNotEmpty({
    groups: [ ValidationGroup.RECIPE ]
  })
  public fooditemId: string | Types.ObjectId;

  public clone (recipeIngredient: RecipeIngredient) {
    if (!recipeIngredient) {
      return undefined;
    }
    this._id = recipeIngredient._id;
    this.amount = recipeIngredient.amount;
    this.fooditemId = recipeIngredient.fooditemId;
    return this;
  }

  public setId = (id: Types.ObjectId | string) => {
    this._id = id;
    return this;
  }

  public setTitle = (amount: number) => {
    this.amount = amount;
    return this;
  }

  public setFooditemId = (id: string | Types.ObjectId) => {
    this.fooditemId = id;
    return this;
  }
}
