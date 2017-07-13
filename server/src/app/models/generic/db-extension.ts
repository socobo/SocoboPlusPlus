import {
  SocoboUserRepository, SocoboUserRoleRepository,
  SocoboUserProviderRepository, SocoboUserImageRepository
} from "../../../socobouser/index";
import {
  RecipeRepository
} from "../../../recipe/index";

export interface DbExtensions {
  socobousers: SocoboUserRepository;
  socobouserRoles: SocoboUserRoleRepository;
  socobouserProviders: SocoboUserProviderRepository;
  socobouserImages: SocoboUserImageRepository;
  recipes: RecipeRepository;
}
