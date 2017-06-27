import { IsNotEmpty, IsNumber, Length, IsString, MinLength } from "class-validator";
import { ValidationGroup } from "./../enums/validation-group";

export class RecipeStep {
  public id: number;
  @IsNotEmpty({
    groups: [ ValidationGroup.RECIPE ]
  })
  @IsNumber({
    groups: [ ValidationGroup.RECIPE ]
  })
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
  @IsNumber({
    groups: [ ValidationGroup.RECIPE ]
  })
  @MinLength(1, {
    groups: [ ValidationGroup.RECIPE ]
  })
  public stepDescription: string;
  public createdDate: number;
  public lastModifiedDate: number;


  public step (stepNumber: number) {
    this.stepNumber = stepNumber;
    return this;
  }

  public description (stepDescription: string) {
    this.stepDescription = stepDescription;
    return this;
  }

  public title (stepTitle: string) {
    this.stepTitle = stepTitle;
    return this;
  }

  public created (createdDate: number) {
    this.createdDate = createdDate;
    return this;
  }

  public lastModified (lastModifiedDate: number) {
    this.lastModifiedDate = lastModifiedDate;
    return this;
  }
}
