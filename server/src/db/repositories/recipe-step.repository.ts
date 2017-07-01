import { IDatabase } from "pg-promise";
import { ErrorUtils } from "./../../logic/utils/index";
import { DbError, ERRORS, RecipeStep } from "./../../models/index";
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

  public save = (steps: RecipeStep[], recipeId: number) => {

    let queries: Promise<any>[] = [];
    steps.forEach((recipeStep: RecipeStep) => {
      recipeStep.setRecipeId(recipeId);
      queries.push(this._saveRecipeStepQuery(recipeStep))
    })

    return this._db.tx("SaveRecipe", (t) => {
      return t.batch(queries);
    });
  }

}