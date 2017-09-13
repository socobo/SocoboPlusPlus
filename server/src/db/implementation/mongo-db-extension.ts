import { Document, Model } from "mongoose";

import { Recipe, RecipeRepository} from "../../recipe/index";
import { SocoboUser, SocoboUserRepository } from "../../socobouser/index";
import { DbExtension } from "../interface/db-extension";

export class MongoDbExtension implements DbExtension {
  public socobouser: SocoboUserRepository;
  public recipe: RecipeRepository;
  // socobouserRoles: SocoboUserRoleRepository;
  // socobouserProviders: SocoboUserProviderRepository;
  // socobouserImages: SocoboUserImageRepository;
  // recipes: RecipeRepository;
  // recipeSteps: RecipeStepRepository;

  constructor (socoboUserModel: Model<Document & SocoboUser>, recipeModel: Model<Document & Recipe>) {
    this.socobouser = new SocoboUserRepository(socoboUserModel);
    this.recipe = new RecipeRepository(recipeModel);
  }
}
