import { DbExtensions } from "../interface/db-extension";
import { SocoboUserRepository } from "../../socobouser/index";

export class MongoDbExtension implements DbExtensions {
  socobouser: SocoboUserRepository;
  // socobouserRoles: SocoboUserRoleRepository;
  // socobouserProviders: SocoboUserProviderRepository;
  // socobouserImages: SocoboUserImageRepository;
  // recipes: RecipeRepository;
  // recipeSteps: RecipeStepRepository;

  constructor () {
    this.socobouser = new SocoboUserRepository(null); // TODO: null wird zu SocoboUser Typegoose Schema Class
  }
}