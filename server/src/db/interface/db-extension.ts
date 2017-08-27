import { FoodItemTemplateRepository } from "../../food/index";
import { SocoboUserRepository } from "../../socobouser/index";

// TODO: extend with new collection repositories
export interface DbExtension {
  fooditemTemplate: FoodItemTemplateRepository;
  socobouser: SocoboUserRepository;
  // recipes: RecipeRepository;
  // recipeSteps: RecipeStepRepository;
}
