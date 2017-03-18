import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';

// Components
import { RootComponent } from './components/root/root.component';
import { RecipeRootComponent } from './recipe/recipe-root/recipe-root.component';

const ROOT_ROUTES: Route[] = [
  {
    path: "recipes",
    loadChildren: "app/recipe/recipe.module#RecipeModule"
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(ROOT_ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
