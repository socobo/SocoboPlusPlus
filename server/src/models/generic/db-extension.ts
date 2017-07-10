import {
  RecipeRepository,
  SocoboUserImageRepository, SocoboUserProviderRepository, SocoboUserRepository, SocoboUserRoleRepository
} from "./../../db/repositories/index";

export interface DbExtensions {
  socobousers: SocoboUserRepository;
  socobouserRoles: SocoboUserRoleRepository;
  socobouserProviders: SocoboUserProviderRepository;
  socobouserImages: SocoboUserImageRepository;
  recipes: RecipeRepository;
}
