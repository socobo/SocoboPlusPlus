import { ArrayMinSize, IsInt, IsNotEmpty, IsNumber, Length, Min, ValidateIf, ValidateNested} from "class-validator";
import { Types } from "mongoose";

import { Validatable, ValidationGroup } from "../../app/index";
import { Level, RecipeCategory, RecipeImage, RecipeStep } from "../index";

import { IsCorrectRecipeLevelUsed } from "../validators/recipe-level.validator";
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
  public categoryId: string;

  public category: RecipeCategory;

  public description: string;

  @ValidateNested({
    each: true,
    groups: [ ValidationGroup.RECIPE ]
  })
  public images: RecipeImage[];

  @IsNotEmpty({
    groups: [ ValidationGroup.RECIPE ]
  })
  @ArrayMinSize(1, {
    groups: [ ValidationGroup.RECIPE ]
  })
  public ingredients: string[];


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

  @ValidateIf((o) => !!o.level, {
    groups: [ ValidationGroup.RECIPE ]
  })
  @IsNotEmpty({
    groups: [ ValidationGroup.RECIPE ]
  })
  @IsCorrectRecipeLevelUsed({
    groups: [ ValidationGroup.RECIPE ]
  })
  public level: Level;

  @ValidateIf((o) => !!o.duration, {
    groups: [ ValidationGroup.RECIPE ]
  })
  @IsInt({
    groups: [ ValidationGroup.RECIPE ]
  })
  @Min(0, {
    groups: [ ValidationGroup.RECIPE ]
  })
  public duration: number;

  public clone (recipe: Recipe) {
    if (!recipe) {
      return undefined;
    }
    this._id = recipe._id;
    this.title = recipe.title;
    this.description = recipe.description;
    this.userId = recipe.userId;
    this.categoryId = recipe.categoryId;
    this.category = new RecipeCategory().clone(recipe.category);
    this.level = recipe.level;
    this.duration = recipe.duration;
    this.images = [];
    this.ingredients = [...recipe.ingredients];
    if (recipe.images) {
      recipe.images.forEach((image: RecipeImage) => {
        this.images.push(new RecipeImage().clone(image));
      });
    }
    this.steps = [];
    if (recipe.steps) {
      recipe.steps.forEach((step: RecipeStep) => {
        this.steps.push(new RecipeStep().clone(step));
      });
    }
    return this;
  }

  public removeImageProp = () => {
    delete this.images;
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

  public setCategoryId (categoryId: string) {
    this.categoryId = categoryId;
    return this;
  }

  public setCategory (category: RecipeCategory) {
    this.category = category;
    return this;
  }

  public setDescription (description: string) {
    this.description = description;
    return this;
  }

  public setImages (images: RecipeImage[]) {
    this.images = images;
    return this;
  }

  public setIngredients (ingredients: string[]) {
    this.ingredients = [...ingredients];
    return this;
  }

  public setSteps (steps: RecipeStep[]) {
    this.steps = steps;
    return this;
  }

  public setLevel (level: Level) {
    this.level = level;
    return this;
  }

  public setDuration (duration: Level) {
    this.duration = duration;
    return this;
  }
}
