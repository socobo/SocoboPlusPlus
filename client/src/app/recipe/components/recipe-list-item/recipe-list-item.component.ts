import { Component, OnInit, Input } from '@angular/core';

import { Recipe } from "./../../model/recipe";

@Component({
  selector: 'scb-recipe-list-item',
  templateUrl: './recipe-list-item.component.html',
  styleUrls: ['./recipe-list-item.component.css']
})
export class RecipeListItemComponent implements OnInit {

  @Input()
  private recipe: Recipe;

  constructor() { }

  ngOnInit() {
  }

}
