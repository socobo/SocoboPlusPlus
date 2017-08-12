import { IsNotEmpty, IsNumber, Length, ValidateNested} from "class-validator";
import { ValidationGroup } from "../../app/index";
import { AreRecipeStepsUnique, AreRecipeStepsOrdered, RecipeStep } from "../index";

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

  @AreRecipeStepsUnique({
    groups: [ ValidationGroup.RECIPE ]
  })
  @AreRecipeStepsOrdered({
    groups: [ ValidationGroup.RECIPE ]
  })
  @ValidateNested({
    each: true,
    groups: [ ValidationGroup.RECIPE ]
  })
  public steps: RecipeStep[];

  constructor () {
    this.fields = new Map();
    this.fields.set("title", this.setTitle);
    this.fields.set("userId", this.setUserId);
    this.fields.set("description", this.setDescription);
    this.fields.set("imageUrl", this.setImageUrl);
  }

  public of (recipe: Recipe) {
    this.title = recipe.title;
    this.description = recipe.description;
    this.id = recipe.id;
    this.imageUrl = recipe.imageUrl;
    this.userId = recipe.userId;
    this.steps = [];
    if (recipe.hasOwnProperty("steps")) {
      recipe.steps.forEach((step) => {
        this.steps.push(new RecipeStep().of(step));
      });
    }
    return this;
  }

  public setTitle (title: string) {
    this.title = title;
    return this;
  }

  public setUserId (userId: number) {
    this.userId = userId;
    return this;
  }

  public setDescription (description: string) {
    this.description = description;
    return this;
  }

  public setImageUrl (imageUrl: string) {
    this.imageUrl = imageUrl;
    return this;
  }

  public setCreated (created: Date) {
    this.created = created;
    return this;
  }

  public setLastModified (lastModified: Date) {
    this.lastModified = lastModified;
    return this;
  }
}
