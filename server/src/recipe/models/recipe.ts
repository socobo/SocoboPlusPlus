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

  public category?: RecipeCategory;

  public description: string;

  @ValidateNested({
    each: true,
    groups: [ ValidationGroup.RECIPE ]
  })
  public images?: RecipeImage[];

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
  public level?: Level;

  @ValidateIf((o) => !!o.duration, {
    groups: [ ValidationGroup.RECIPE ]
  })
  @IsInt({
    groups: [ ValidationGroup.RECIPE ]
  })
  @Min(0, {
    groups: [ ValidationGroup.RECIPE ]
  })
  public duration?: number;

  public collaborators: string[];

  @IsNotEmpty({
    groups: [ ValidationGroup.RECIPE ]
  })
  public isPublic: boolean;

  @IsNotEmpty({
    groups: [ ValidationGroup.RECIPE ]
  })
  public owner: string;

  public readers: string[];

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

    this.ingredients = recipe.ingredients ? [...recipe.ingredients] : [];
    this.images = recipe.images
      ? recipe.images.map((image: RecipeImage) => new RecipeImage().clone(image))
      : [];

    this.steps = recipe.steps
      ? recipe.steps.map((step: RecipeStep) => new RecipeStep().clone(step))
      : [];

    this.collaborators = recipe.collaborators  ? [...recipe.collaborators] : [];

    this.owner = recipe.owner;
    this.readers = recipe.readers ? [...recipe.readers] : [];
    this.isPublic = recipe.isPublic;
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

  public setOwner (owner: string) {
    this.owner = owner;
    return this;
  }

  public setIsPublic (isPublic: boolean) {
    this.isPublic = isPublic;
    return this;
  }

  public setCollaborators (collaborators: string[]) {
    this.collaborators = [...collaborators];
    return this;
  }

  public setReaders (readers: string[]) {
    this.readers = [...readers];
    return this;
  }
}
