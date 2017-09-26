import { IsNotEmpty, IsNumber, IsString, Length, MinLength } from "class-validator";
import { Validatable, ValidationGroup } from "../../app/index";

export class RecipeStep implements Validatable {
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

  public clone (step: RecipeStep): RecipeStep {
    this.stepTitle = step.stepTitle;
    this.stepDescription = step.stepDescription;
    this.stepNumber = step.stepNumber;
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
}
