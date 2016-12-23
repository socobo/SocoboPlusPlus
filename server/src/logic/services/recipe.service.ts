import { IDatabase } from "pg-promise";

import { Recipe } from "./../../models/recipe"

export class RecipeService {

    constructor(private _db: IDatabase<any>){}

    save(recipe: Recipe): Promise<number>{
        return this._db.tx((t) => {
            let addNewRecipe = 'insert into recipe(title) values($1) returning id';
            this._db.one(addNewRecipe, [recipe.title]);
        });
    }

}