import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Components
import { RecipeRootComponent } from "./components/recipe-root/recipe-root.component";

// Routes
import { RecipeRoutingModule } from "./recipe-routing.module";
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';


@NgModule({
  imports: [
    CommonModule,
    RecipeRoutingModule
  ],
  declarations: [
    RecipeRootComponent,
    RecipeListComponent
  ]
})
export class RecipeModule { }
