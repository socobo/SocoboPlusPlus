import { IsNotEmpty, IsNumber, IsString, Min, Length, MinLength } from "class-validator";
import { Validatable, ValidationGroup } from "../../app/index";

export class RecipeImage implements Validatable {
  @IsNotEmpty({
    groups: [ValidationGroup.RECIPE]
  })
  public url: string;

  @IsNotEmpty({
    groups: [ValidationGroup.RECIPE]
  })
  @Length(1,100, {
    groups: [ValidationGroup.RECIPE]
  })
  public title: string;

  public clone (image: RecipeImage): RecipeImage {
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
