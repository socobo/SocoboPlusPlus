import { Document, Model } from "mongoose";
import { DbExtension } from "../interface/db-extension";
import { SocoboUserRepository } from "../../socobouser/index";
import { SocoboUser } from "../../socobouser/models/SocoboUser";

export class MongoDbExtension implements DbExtension {
  socobouser: SocoboUserRepository;
  // socobouserRoles: SocoboUserRoleRepository;
  // socobouserProviders: SocoboUserProviderRepository;
  // socobouserImages: SocoboUserImageRepository;
  // recipes: RecipeRepository;
  // recipeSteps: RecipeStepRepository;

  constructor (socoboUserModel: Model<SocoboUser & Document>) {
    this.socobouser = new SocoboUserRepository(socoboUserModel);
  }
}