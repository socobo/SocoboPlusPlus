import {
  RecipeRepository
} from "../../../recipe/index";
import {
  SocoboUserImageRepository, SocoboUserProviderRepository,
  SocoboUserRepository, SocoboUserRoleRepository
} from "../../../socobouser/index";

export interface DbExtensions {
  socobousers: SocoboUserRepository;
  socobouserRoles: SocoboUserRoleRepository;
  socobouserProviders: SocoboUserProviderRepository;
  socobouserImages: SocoboUserImageRepository;
  recipes: RecipeRepository;
}
