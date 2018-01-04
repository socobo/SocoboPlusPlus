import { IsInt, IsNotEmpty} from "class-validator";
import { Types } from "mongoose";

import { Validatable, ValidationGroup } from "../../app/index";
import { FoodItemTemplate } from "./../../food/index";

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
  public fooditemTemplateId: string | Types.ObjectId;
  public fooditemTemplate?: FoodItemTemplate;

  public clone (recipeIngredient: RecipeIngredient) {
    if (!recipeIngredient) {
      return undefined;
    }
    this._id = recipeIngredient._id;
    this.amount = recipeIngredient.amount;
    this.fooditemTemplateId = recipeIngredient.fooditemTemplateId;
    this.fooditemTemplate = new FoodItemTemplate().clone(recipeIngredient.fooditemTemplate);
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

  public setFooditemTemplateId = (id: string | Types.ObjectId) => {
    this.fooditemTemplateId = id;
    return this;
  }

  public setFooditemTemplate = (fit: FoodItemTemplate) => {
    this.fooditemTemplate = fit;
    return this;
  }
}
