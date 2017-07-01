import { IDatabase } from "pg-promise";
import { ErrorUtils } from "./../../logic/utils/index";
import { DbError, ERRORS, Recipe, RecipeStep } from "./../../models/index";
import { DbExtensions } from "./../../models/index";

export class RecipeStepRepository {

  private _db: IDatabase<DbExtensions>&DbExtensions;

  constructor (db: any) {
    this._db = db;
  }

  private _saveRecipeStepQuery = (step: RecipeStep) => {
    const query: string = `insert into recipe_steps(
                             title, description, stepNumber,
                             recipeId)
                           values($1, $2, $3, $4)
                           returning id`;
    return this._db.one(query, [
      step.stepTitle, step.stepDescription, step.stepNumber,
      step.recipeId]);
  }

  public save = (steps: RecipeStep[], recipe: Recipe) => {

    let queries: Promise<any>[] = [];
    steps.forEach((recipeStep: RecipeStep) => {
      console.log('step', recipeStep)
      recipeStep
        .setCreated(recipe.created.getTime())
        .setLastModified(recipe.created.getTime())
        .setRecipeId(recipe.id);
      queries.push(this._saveRecipeStepQuery(recipeStep))
    })

    return this._db.tx("SaveRecipe", (t) => {
      return t.batch(queries);
    });
  }

  public getRecipeSteps = (recipeId: number) => {
    const query: string = `select * from recipe_steps
                            where recipe_steps.recipeId = $1`;
    return this._db.many(query, [
      recipeId]);
  }

}