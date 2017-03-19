import { Component, OnInit } from '@angular/core';

import { RecipeService } from "./../../services/recipe.service";
import { Recipe } from "./../../model/recipe";

@Component({
  selector: 'scb-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  private recipes: Recipe[];
  private errorMsg: string;

  constructor(private recipeService: RecipeService) { }

  private _listRecipes() {
    this.recipeService.getAllRecipes().subscribe(
      recipes => this.recipes = recipes,
      error => this.errorMsg = error as string
    );
  }

  ngOnInit() {
    this._listRecipes();
  }

}
