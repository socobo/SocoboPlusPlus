import { Document, Model } from "mongoose";
import { SocoboUser, SocoboUserRepository } from "../../socobouser/index";
import { DbExtension } from "../interface/db-extension";

export class MongoDbExtension implements DbExtension {
  public socobouser: SocoboUserRepository;
  // TODO: recipe: RecipeRepository;

  constructor (socoboUserModel: Model<Document & SocoboUser>) {
    this.socobouser = new SocoboUserRepository(socoboUserModel);
  }
}
