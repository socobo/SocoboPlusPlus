
import { FoodItemTemplate, FoodItemTemplateRepository } from "../../food/index";
import { Recipe, RecipeRepository} from "../../recipe/index";
import { SocoboUser, SocoboUserRepository } from "../../socobouser/index";
import { DbExtension } from "../interface/db-extension";

export class MongoDbExtension implements DbExtension {

  public fooditemTemplate: FoodItemTemplateRepository;
  public socobouser: SocoboUserRepository;
  public recipe: RecipeRepository;
  // socobouserRoles: SocoboUserRoleRepository;
  // socobouserProviders: SocoboUserProviderRepository;
  // socobouserImages: SocoboUserImageRepository;
  // recipes: RecipeRepository;
  // recipeSteps: RecipeStepRepository;

  constructor (socoboUserModel: Model<Document & SocoboUser>) {
    this.socobouser = new SocoboUserRepository(socoboUserModel);
  constructor (
    private _fooditemTemplateModel: Model<Document & FoodItemTemplate>,
    private _socoboUserModel: Model<Document & SocoboUser>,
    private _recipeModel: Model<Document & Recipe>
  ) {
    this.fooditemTemplate = new FoodItemTemplateRepository(_fooditemTemplateModel);
    this.socobouser = new SocoboUserRepository(_socoboUserModel);
    this.recipe = new RecipeRepository(_recipeModel);
  }
}
