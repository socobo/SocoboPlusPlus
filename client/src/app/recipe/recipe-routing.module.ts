import { NgModule } from "@angular/core";
import { RouterModule, Route } from "@angular/router";

// Components
import { RecipeRootComponent } from "./components/recipe-root/recipe-root.component";
import { RecipeListComponent } from "./components/recipe-list/recipe-list.component";

const RECIPE_ROUTES: Route[] = [
  {
    path: "",
    component: RecipeListComponent
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
