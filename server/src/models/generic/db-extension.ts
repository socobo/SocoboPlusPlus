import { RecipeRepository, RecipeStepRepository, UserRepository } from "./../../db/repositories/index";

export interface DbExtensions {
  users: UserRepository;
  recipes: RecipeRepository;
  recipeSteps: RecipeStepRepository;
}
