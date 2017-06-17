import { IsNotEmpty, IsNumber, Length } from "class-validator";
import { ValidationGroup } from "./../enums/validation-group";
import { FoodItem, RecipeStep, SocoboUser } from "./../index";

export class Recipe {

  public id: number;

  @IsNotEmpty({
    groups: [ ValidationGroup.RECIPE ]
  })
  @Length(1, 50, {
    groups: [ ValidationGroup.RECIPE ]
  })
  public title: string;

  @IsNumber({
    groups: [ ValidationGroup.RECIPE ]
  })
  public userId: number;
  public description: string;
  public imageUrl: string;
  public created: Date;
  public lastModified: Date;
  public steps: RecipeStep[];
  public ingredients: FoodItem[];

  public addTitle (title: string) {
    this.title = title;
    return this;
  }

  public addUserId (userId: number) {
    this.userId = userId;
    return this;
  }

  public addDescription (description: string) {
    this.description = description;
    return this;
  }

  public addImageUrl (imageUrl: string) {
    this.imageUrl = imageUrl;
    return this;
  }

  public addCreated (created: Date) {
    this.created = created;
    return this;
  }

  public addLastModified (lastModified: Date) {
    this.lastModified = lastModified;
    return this;
  }
}
