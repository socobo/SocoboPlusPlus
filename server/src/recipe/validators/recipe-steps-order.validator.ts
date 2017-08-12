import {
  registerDecorator, ValidationArguments, ValidationOptions,
  ValidatorConstraint, ValidatorConstraintInterface
} from "class-validator";
import { RecipeStep } from "../index";

@ValidatorConstraint({ name: "RecipeStepsOrder", async: false })
export class RecipeStepsAreOrderd implements ValidatorConstraintInterface {

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
