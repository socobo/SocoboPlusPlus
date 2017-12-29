import { RecipeCategory } from './../../recipe/models/recipe-category';
import { FoodItemCategoryRepository, FoodItemTemplateRepository, FoodItemUnitRepository } from "../../food/index";
import { CrudRepository, RecipeIngredient, RecipeRepository } from "../../recipe/index";

import { SocoboUserRepository } from "../../socobouser/index";

// TODO: extend with new collection repositories
export interface DbExtension {
  fooditemTemplate: FoodItemTemplateRepository;
  fooditemCategory: FoodItemCategoryRepository;
  fooditemUnit: FoodItemUnitRepository;
  socobouser: SocoboUserRepository;
  recipe: RecipeRepository;
  recipeCategory: CrudRepository<RecipeCategory>;
  recipeIngredient: CrudRepository<RecipeIngredient>;
}
