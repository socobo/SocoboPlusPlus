import { IsNotEmpty, IsNumber, Length } from "class-validator";
import { FoodItem, RecipeStep, SocoboUser, ValidationGroup } from "./../index";

export class Recipe {

  public fields: Map<string, Function>;

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

  constructor () {
    this.fields = new Map();
    this.fields.set("title", this.addTitle);
    this.fields.set("userId", this.addUserId);
    this.fields.set("description", this.addDescription);
    this.fields.set("imageUrl", this.addImageUrl);
  }

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
