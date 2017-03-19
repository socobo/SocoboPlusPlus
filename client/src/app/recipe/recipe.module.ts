import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

// Components
import { RecipeRootComponent } from "./components/recipe-root/recipe-root.component";

// Services
import { RecipeService } from "./services/recipe.service";

// Routes
import { RecipeRoutingModule } from "./recipe-routing.module";
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { RecipeListItemComponent } from './components/recipe-list-item/recipe-list-item.component';


@NgModule({
  imports: [
    CommonModule,
    RecipeRoutingModule
  ],
  declarations: [
    RecipeRootComponent,
    RecipeListComponent,
    RecipeListItemComponent
  ],
  providers: [
    RecipeService
  ]
})
export class RecipeModule { }
