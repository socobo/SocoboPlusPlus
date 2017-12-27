import {
  FoodItemCategoryRepository, FoodItemTemplateRepository, FoodItemUnitRepository
} from "../../food/index";
import { RecipeRepository } from "../../recipe/index";
import { SocoboUserRepository } from "../../socobouser/index";

// TODO: extend with new collection repositories
export interface DbExtension {
  fooditemTemplate: FoodItemTemplateRepository;
  fooditemCategory: FoodItemCategoryRepository;
  fooditemUnit: FoodItemUnitRepository;
  socobouser: SocoboUserRepository;
  recipe: RecipeRepository;
}
