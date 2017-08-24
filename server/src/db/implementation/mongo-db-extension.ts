import { Document, Model } from "mongoose";
import { DbExtension } from "../interface/db-extension";
import { SocoboUserRepository, SocoboUser } from "../../socobouser/index";

export class MongoDbExtension implements DbExtension {
  socobouser: SocoboUserRepository;
  // TODO: recipe: RecipeRepository;

  constructor (socoboUserModel: Model<Document & SocoboUser>) {
    this.socobouser = new SocoboUserRepository(socoboUserModel);
  }
}
