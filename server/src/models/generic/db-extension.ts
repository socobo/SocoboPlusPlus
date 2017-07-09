import {
  RecipeRepository,
  SocoboUserRepository, SocoboUserRoleRepository
} from "./../../db/repositories/index";

export interface DbExtensions {
  socobousers: SocoboUserRepository;
  socobouserRoles: SocoboUserRoleRepository;
  recipes: RecipeRepository;
}
