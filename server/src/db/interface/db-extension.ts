import { FoodItemCategoryRepository, FoodItemTemplateRepository, FoodItemUnitRepository } from "../../food/index";
import { RecipeCategoryRepository, RecipeIngredientRepository, RecipeRepository } from "../../recipe/index";

import { SocoboUserRepository } from "../../socobouser/index";

// TODO: extend with new collection repositories
export interface DbExtension {
  fooditemTemplate: FoodItemTemplateRepository;
  fooditemCategory: FoodItemCategoryRepository;
  fooditemUnit: FoodItemUnitRepository;
  socobouser: SocoboUserRepository;
  recipe: RecipeRepository;
  recipeCategory: RecipeCategoryRepository;
  recipeIngredient: RecipeIngredientRepository
}
