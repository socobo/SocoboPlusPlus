import { IDatabase } from "pg-promise";

import { Recipe } from "./../../models/recipe"

export class RecipeService {

    private _GET_BY_ID: string = `select * 
                                    from recipes
                                    where recipes.id = $1`;
    private _SAVE: string = `insert into recipes(
                                title,
                                userId,
                                description,
                                imageUrl,
                                created)
                             values($1, $2, $3, $4, $5)
                             returning id`;

    constructor (private _db: IDatabase<any>) {}

    getById(id: number): Promise<Recipe> {
        console.log('ID', id);
        return this._db.one(this._GET_BY_ID, [id]);
    }

    save(recipe: Recipe): Promise<number> {
        return this._db.tx((t) => {
            return this._db.one(this._SAVE, [
                recipe.title, 
                recipe.userId, 
                recipe.description,
                recipe.imageUrl,
                new Date()]);
        });
    }

}