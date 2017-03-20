import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
// Components
import { RecipeRootComponent } from "./components/recipe-root/recipe-root.component";
// Routes
import { RecipeRoutingModule } from "./recipe-routing.module";


@NgModule({
  imports: [
    CommonModule,
    RecipeRoutingModule
  ],
  declarations: [
    RecipeRootComponent
  ]
})
export class RecipeModule { }
