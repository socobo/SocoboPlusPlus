import { IsNotEmpty, IsNumber, Length, ValidateNested} from "class-validator";
import { ValidationGroup } from "./../enums/validation-group";
import { FoodItem, RecipeStep, SocoboUser } from "./../index";

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
  @ValidateNested({
    each: true,
    groups: [ ValidationGroup.RECIPE ]
  })
  public steps: RecipeStep[];

  constructor () {
    this.fields = new Map();
    this.fields.set("title", this.addTitle);
    this.fields.set("userId", this.addUserId);
    this.fields.set("description", this.addDescription);
    this.fields.set("imageUrl", this.addImageUrl);
  }

  public of (recipe: Recipe) {
    this.title = recipe.title;
    this.description = recipe.description;
    this.id = recipe.id;
    this.imageUrl = recipe.imageUrl;
    this.userId = recipe.userId;
    this.steps = [];
    recipe.steps.forEach((step) => {
      this.steps.push(new RecipeStep().of(step));
    });
    return this;
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
