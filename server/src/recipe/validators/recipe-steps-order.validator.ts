import {
  registerDecorator, ValidationArguments, ValidationOptions,
  ValidatorConstraint, ValidatorConstraintInterface
} from "class-validator";
import { RecipeStep } from "../../models/database/recipe-step";

@ValidatorConstraint({ name: "RecipeStepsOrder", async: false })
export class RecipeStepsAreOrderd implements ValidatorConstraintInterface {

  private _sortAsc = (leftNumber: number, rightNumber: number): number => {
    if (leftNumber < rightNumber) {
      return -1;
    } else if (leftNumber > rightNumber) {
      return 1;
    } else {
      return 0;
    }
  }

  public validate (recipeSteps: RecipeStep[], args: ValidationArguments): boolean {
    if (!recipeSteps) {
      return false;
    }
    const recipeStepNumbers = recipeSteps
      .map((step) => step.stepNumber)
      .sort();
    for (let i = 1; i <= recipeStepNumbers.length; i++) {
      if (recipeStepNumbers[i - 1] !== i) {
        return false;
      }
    }
    return true;
  }

  public defaultMessage (args: ValidationArguments): string {
    return "Recipe step numbers must be in correct order";
  }
}

export function AreRecipeStepsOrdered (validationOptions?: ValidationOptions) {
   return (object: Object, propertyName: string) => {
      registerDecorator({
        constraints: [],
        options: validationOptions,
        propertyName,
        target: object.constructor,
        validator: RecipeStepsAreOrderd
      });
   };
}
