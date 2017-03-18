import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

// Components
import { RootComponent } from "./components/root/root.component";

// Modules
import { RecipeModule } from "./recipe/recipe.module";

// Routes
import { AppRoutingModule } from "./app-routing.module";

@NgModule({
  declarations: [
    RootComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RecipeModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class AppModule { }
