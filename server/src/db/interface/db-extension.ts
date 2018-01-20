import {
  FoodItemCategoryRepository, FoodItemRepository,
  FoodItemTemplateRepository, FoodItemUnitRepository
} from "../../food/index";
import {
  CrudRepository, RecipeCategory, RecipeIngredient, RecipeRepository
} from "../../recipe/index";
import { SocoboUserRepository } from "../../socobouser/index";

export interface DbExtension {
  fooditemTemplate: FoodItemTemplateRepository;
  fooditemCategory: FoodItemCategoryRepository;
  fooditemUnit: FoodItemUnitRepository;
  fooditem: FoodItemRepository;
  socobouser: SocoboUserRepository;
  recipe: RecipeRepository;
  recipeCategory: CrudRepository<RecipeCategory>;
  recipeIngredient: CrudRepository<RecipeIngredient>;
}
