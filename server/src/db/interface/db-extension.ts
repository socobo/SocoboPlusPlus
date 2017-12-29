import {
  FoodItemCategoryRepository, FoodItemRepository,
  FoodItemTemplateRepository, FoodItemUnitRepository
} from "../../food/index";
import { RecipeCategoryRepository, RecipeRepository } from "../../recipe/index";

import { SocoboUserRepository } from "../../socobouser/index";

// TODO: extend with new collection repositories
export interface DbExtension {
  fooditemTemplate: FoodItemTemplateRepository;
  fooditemCategory: FoodItemCategoryRepository;
  fooditemUnit: FoodItemUnitRepository;
  fooditem: FoodItemRepository;
  socobouser: SocoboUserRepository;
  recipe: RecipeRepository;
  recipeCategory: RecipeCategoryRepository;
}
