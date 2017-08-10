import { IsNotEmpty, IsNumber, IsString, Length, MinLength } from "class-validator";
import { ValidationGroup } from "./../enums/validation-group";

export class RecipeStep {
  public id: number;
  public recipeId: number;
  @IsNotEmpty({
    groups: [ ValidationGroup.RECIPE ]
  })
  @Length(1, 50, {
    groups: [ ValidationGroup.RECIPE ]
  })
  public stepTitle: string;
  @IsNotEmpty({
    groups: [ ValidationGroup.RECIPE ]
  })
  @IsNumber({
    groups: [ ValidationGroup.RECIPE ]
  })
  public stepNumber: number;
  @IsNotEmpty({
    groups: [ ValidationGroup.RECIPE ]
  })
  @MinLength(1, {
    groups: [ ValidationGroup.RECIPE ]
  })
  public stepDescription: string;
  public createdDate: number;
  public lastModifiedDate: number;

  public of (step: RecipeStep) {
      this.id = step.id;
      this.recipeId = step.recipeId;
      this.stepTitle = step.stepTitle;
      this.stepDescription = step.stepDescription;
      this.stepNumber = step.stepNumber;
      return this;
  }

  public setRecipeId (recipeId: number) {
    this.recipeId = recipeId;
    return this;
  }

  public setStep (stepNumber: number) {
    this.stepNumber = stepNumber;
    return this;
  }

  public setDescription (stepDescription: string) {
    this.stepDescription = stepDescription;
    return this;
  }

  public setTitle (stepTitle: string) {
    this.stepTitle = stepTitle;
    return this;
  }

  public setCreated (createdDate: number) {
    this.createdDate = createdDate;
    return this;
  }

  public setLastModified (lastModifiedDate: number) {
    this.lastModifiedDate = lastModifiedDate;
    return this;
  }
}
