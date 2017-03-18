import { NgModule } from "@angular/core";
import { RouterModule, Route } from "@angular/router";

// Components
import { RecipeRootComponent } from "./recipe-root/recipe-root.component";

const RECIPE_ROUTES: Route[] = [
  {
    path: "",
    component: RecipeRootComponent
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(RECIPE_ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class RecipeRoutingModule { }
