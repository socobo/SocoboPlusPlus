import { Validatable } from "../index";
import { IsNotEmpty, IsNumber, IsString, Length, MinLength } from "class-validator";
import { ValidationGroup } from "./../enums/validation-group";

export class RecipeStep implements Validatable{
  public id: number;
  public recipeId: number;
  @IsNotEmpty({
    groups: [ValidationGroup.RECIPE]
  })
  @Length(1, 50, {
    groups: [ValidationGroup.RECIPE]
  })
  public stepTitle: string;
  @IsNotEmpty({
    groups: [ValidationGroup.RECIPE]
  })
  @IsNumber({
    groups: [ValidationGroup.RECIPE]
  })
  public stepNumber: number;
  @IsNotEmpty({
    groups: [ValidationGroup.RECIPE]
  })
  @MinLength(1, {
    groups: [ValidationGroup.RECIPE]
  })
  public stepDescription: string;
  public createdDate: number;
  public lastModifiedDate: number;

  public of (step: RecipeStep): RecipeStep {
    this.id = step.id;
    this.recipeId = step.recipeId;
    this.stepTitle = step.stepTitle;
    this.stepDescription = step.stepDescription;
    this.stepNumber = step.stepNumber;
    return this;
  }

  public setId (id: number): RecipeStep {
    this.id = id;
    return this;
  }

  public setRecipeId (recipeId: number): RecipeStep {
    this.recipeId = recipeId;
    return this;
  }

  public setStep (stepNumber: number): RecipeStep {
    this.stepNumber = stepNumber;
    return this;
  }

  public setDescription (stepDescription: string): RecipeStep {
    this.stepDescription = stepDescription;
    return this;
  }

  public setTitle (stepTitle: string): RecipeStep {
    this.stepTitle = stepTitle;
    return this;
  }

  public setCreated (createdDate: number): RecipeStep {
    this.createdDate = createdDate;
    return this;
  }

  public setLastModified (lastModifiedDate: number): RecipeStep {
    this.lastModifiedDate = lastModifiedDate;
    return this;
  }
}
