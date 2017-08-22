import { Document, Model } from "mongoose";
import { DbExtension } from "../interface/db-extension";
import { SocoboUserRepository, SocoboUser } from "../../socobouser/index";
import { ISocoboUserModel } from "../../socobouser/interfaces/ISocoboUserModel";

export class MongoDbExtension implements DbExtension {
  socobouser: SocoboUserRepository;
  // socobouserRoles: SocoboUserRoleRepository;
  // socobouserProviders: SocoboUserProviderRepository;
  // socobouserImages: SocoboUserImageRepository;
  // recipes: RecipeRepository;
  // recipeSteps: RecipeStepRepository;

  constructor (socoboUserModel: Model<ISocoboUserModel>) {
    this.socobouser = new SocoboUserRepository(socoboUserModel);
  }
}