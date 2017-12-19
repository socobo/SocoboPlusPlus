import { FoodItemTemplateRepository, FoodItemUnitRepository } from "../../food/index";
import { RecipeRepository, RecipeCategoryRepository } from "../../recipe/index";
import { SocoboUserRepository } from "../../socobouser/index";

// TODO: extend with new collection repositories
export interface DbExtension {
  fooditemTemplate: FoodItemTemplateRepository;
  fooditemUnit: FoodItemUnitRepository;
  socobouser: SocoboUserRepository;
  recipe: RecipeRepository,
  recipeCategories: RecipeCategoryRepository;
}
