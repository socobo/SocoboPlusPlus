import { FoodItemTemplateRepository, FoodItemUnitRepository } from "../../food/index";
import { RecipeCategoryRepository, RecipeRepository } from "../../recipe/index";
import { SocoboUserRepository } from "../../socobouser/index";

// TODO: extend with new collection repositories
export interface DbExtension {
  fooditemTemplate: FoodItemTemplateRepository;
  fooditemUnit: FoodItemUnitRepository;
  socobouser: SocoboUserRepository;
  recipe: RecipeRepository;
  recipeCategory: RecipeCategoryRepository;
}
