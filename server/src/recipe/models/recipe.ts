import { IsNotEmpty, IsNumber, Length, ValidateNested} from "class-validator";
import { Types } from "mongoose";

import { Validatable, ValidationGroup } from "../../app/index";
import { RecipeStep } from "../index";
import { AreRecipeStepsOrdered } from "../validators/recipe-steps-order.validator";
import { AreRecipeStepsUnique } from "../validators/recipe-steps-unique.validator";
export class Recipe implements Validatable {

  public _id: Types.ObjectId;
  @IsNotEmpty({
    groups: [ ValidationGroup.RECIPE ]
  })
  @Length(1, 50, {
    groups: [ ValidationGroup.RECIPE ]
  })
  public title: string;
  @IsNotEmpty({
    groups: [ ValidationGroup.RECIPE ]
  })
  public userId: string;
  public description: string;
  public imageUrl: string;

  @AreRecipeStepsUnique({
    groups: [ ValidationGroup.RECIPE ]
  })
  @AreRecipeStepsOrdered({
    groups: [ ValidationGroup.RECIPE ]
  })
  @ValidateNested({
    each: true,
    groups: [ ValidationGroup.RECIPE ]
  })
  public steps: RecipeStep[];

  public clone (recipe: Recipe) {
    this._id = recipe._id;
    this.title = recipe.title;
    this.description = recipe.description;
    this.imageUrl = recipe.imageUrl;
    this.userId = recipe.userId;
    this.steps = [];
    if (recipe.steps) {
      recipe.steps.forEach((step: RecipeStep) => {
        this.steps.push(new RecipeStep().clone(step));
      });
    }
    return this;
  }

  public setRecipeId (recipeId: Types.ObjectId) {
    this._id = recipeId;
    return this;
  }

  public setTitle (title: string) {
    this.title = title;
    return this;
  }

  public setUserId (userId: string) {
    this.userId = userId;
    return this;
  }

  public setDescription (description: string) {
    this.description = description;
    return this;
  }

  public setImageUrl (imageUrl: string) {
    this.imageUrl = imageUrl;
    return this;
  }

  public setSteps (steps: RecipeStep[]) {
    this.steps = steps;
    return this;
  }
}
