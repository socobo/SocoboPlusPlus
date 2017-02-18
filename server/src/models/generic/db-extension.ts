import { RecipeRepository, UserRepository } from "./../../db/repositories/index";

export interface DbExtensions {
    users: UserRepository;
    recipes: RecipeRepository;
}