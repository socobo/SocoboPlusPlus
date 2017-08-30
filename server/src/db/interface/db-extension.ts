// import {
//   RecipeRepository, RecipeStepRepository
// } from "../../../recipe/index";
// import {
//   SocoboUserImageRepository, SocoboUserProviderRepository,
//   SocoboUserRepository, SocoboUserRoleRepository
// } from "../../../socobouser/index";

import { SocoboUserRepository } from "../../socobouser/index";

// TODO: extend with new collection repositories
export interface DbExtensions {
  socobouser: SocoboUserRepository;
  // socobouserRoles: SocoboUserRoleRepository;
  // socobouserProviders: SocoboUserProviderRepository;
  // socobouserImages: SocoboUserImageRepository;
  // recipes: RecipeRepository;
  // recipeSteps: RecipeStepRepository;
}
