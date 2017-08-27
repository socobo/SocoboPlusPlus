import { Document, Model } from "mongoose";
import { FoodItemTemplate, FoodItemTemplateRepository } from "../../food/index";
import { SocoboUser, SocoboUserRepository } from "../../socobouser/index";
import { DbExtension } from "../interface/db-extension";

export class MongoDbExtension implements DbExtension {

  public fooditemTemplate: FoodItemTemplateRepository;
  public socobouser: SocoboUserRepository;
  // TODO: recipe: RecipeRepository;

  constructor (
    private _fooditemTemplateModel: Model<Document & FoodItemTemplate>,
    private _socoboUserModel: Model<Document & SocoboUser>
  ) {
    this.fooditemTemplate = new FoodItemTemplateRepository(_fooditemTemplateModel);
    this.socobouser = new SocoboUserRepository(_socoboUserModel);
  }
}
