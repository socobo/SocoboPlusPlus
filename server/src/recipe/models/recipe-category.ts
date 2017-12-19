import { IsInt, IsNotEmpty, IsNumber, Length, Min, ValidateIf, ValidateNested} from "class-validator";
import { Types } from "mongoose";

import { Validatable, ValidationGroup } from "../../app/index";
export class RecipeCategory implements Validatable {

  public _id: Types.ObjectId;
  @IsNotEmpty({
    groups: [ ValidationGroup.RECIPE ]
  })
  @Length(1, 50, {
    groups: [ ValidationGroup.RECIPE ]
  })
  public title: string;

  public description: string;

  public clone (recipeCategory: RecipeCategory) {
    if(!recipeCategory){
      return undefined;
    }
    this._id = recipeCategory._id;
    this.title = recipeCategory.title;
    this.description = recipeCategory.description;
    return this;
  }

  setTitle = (title: string) => {
    this.title = title;
    return this;
  }

  setDescription = (description: string) => {
    this.description = description;
    return this;
  }
}
