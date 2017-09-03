import {
  registerDecorator, ValidationArguments, ValidationOptions,
  ValidatorConstraint, ValidatorConstraintInterface
} from "class-validator";
import { Level, Recipe } from "../index";

@ValidatorConstraint({ name: "RecipeLevel", async: false })
export class RecipeLevel implements ValidatorConstraintInterface {

  public validate (level: string, args: ValidationArguments): boolean {
    if (!level) {
      return false;
    }

    let inLevel = (level in Level) && isNaN(+level);

    return inLevel;
  }

  public defaultMessage (args: ValidationArguments): string {
    let levels = "";
    for(let level in Level){
      if(isNaN(+level)){
        levels += level + ", "
      }
    }
    levels = levels.substring(0, levels.length - 2);
    return "Recipe level must be one of: " + levels;
  }
}

export function IsCorrectRecipeLevelUsed (validationOptions?: ValidationOptions) {
   return (object: object, propertyName: string) => {
      registerDecorator({
        constraints: [],
        options: validationOptions,
        propertyName,
        target: object.constructor,
        validator: RecipeLevel
      });
   };
}
