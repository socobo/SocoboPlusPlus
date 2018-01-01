import { IsNotEmpty, IsNumber, IsString, Length, Min, MinLength } from "class-validator";
import { Schema } from "mongoose";
import { Validatable, ValidationGroup } from "../../app/index";

export class RecipeImage implements Validatable {
  public _id: Schema.Types.ObjectId;
  @IsNotEmpty({
    groups: [ValidationGroup.RECIPE]
  })
  public url: string;

  @IsNotEmpty({
    groups: [ValidationGroup.RECIPE]
  })
  @Length(1, 100, {
    groups: [ValidationGroup.RECIPE]
  })
  public title: string;

  public clone (image: RecipeImage): RecipeImage {
    if (!image) {
      return undefined;
    }
    this.url = image.url;
    this.title = image.title;
    return this;
  }

  public setUrl (url: string): RecipeImage {
    this.url = url;
    return this;
  }

  public setTitle (title: string): RecipeImage {
    this.title = title;
    return this;
  }
}
