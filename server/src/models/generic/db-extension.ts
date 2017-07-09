import { RecipeRepository, SocoboUserRepository } from "./../../db/repositories/index";

export interface DbExtensions {
  socobousers: SocoboUserRepository;
  recipes: RecipeRepository;
}
