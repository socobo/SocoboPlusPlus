import {
  registerDecorator, ValidationArguments, ValidationOptions,
  ValidatorConstraint, ValidatorConstraintInterface
} from "class-validator";
import { RecipeStep } from "../../models/database/recipe-step";

@ValidatorConstraint({ name: "RecipeStepsUnique", async: false })
export class RecipeStepsAreUnique implements ValidatorConstraintInterface {

  private _onlyUnique = (value: number, index: number, self: number[]): boolean => {
    return self.indexOf(value) === index;
  }

  public validate (recipeSteps: RecipeStep[], args: ValidationArguments): boolean {
    if (!recipeSteps) {
      return false;
    }
    const recipeStepNumbers = recipeSteps.map((step) => step.stepNumber);
    const uniqueRecipeStepNumbers = recipeStepNumbers.filter(this._onlyUnique);
    return uniqueRecipeStepNumbers.length === recipeStepNumbers.length;
  }

  public defaultMessage (args: ValidationArguments): string {
    return "Recipe step numbers must be unique";
  }

}

export function AreRecipeStepsUnique (validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      constraints: [],
      options: validationOptions,
      propertyName,
      target: object.constructor,
      validator: RecipeStepsAreUnique
    });
  };
}
