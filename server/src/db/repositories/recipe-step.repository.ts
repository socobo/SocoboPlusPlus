import { IDatabase } from "pg-promise";
import { ErrorUtils } from "./../../logic/utils/index";
import { DbError, ERRORS, Recipe, RecipeStep } from "./../../models/index";
import { DbExtensions } from "./../../models/index";

export class RecipeStepRepository {

  private _db: IDatabase<DbExtensions>&DbExtensions;

  constructor (db: any) {
    this._db = db;
  }

  private _saveQuery = (step: RecipeStep) => {
    const query: string = `insert into recipe_steps(title, description, stepNumber, recipeId)
                           values($1, $2, $3, $4)
                           returning id`;
    return this._db.one(query, [step.stepTitle, step.stepDescription, step.stepNumber, step.recipeId]);
  }

  private _updateQuery = (step: RecipeStep) => {
    const query: string = `update recipe_steps set
                             title=$2, description=$3, stepNumber=$4
                           where recipe_steps.id=$1`;
    return this._db.none(query, [step.id, step.stepTitle, step.stepDescription, step.stepNumber]);
  }

  public save = (steps: RecipeStep[], recipe: Recipe) => {

    const queries: Array<Promise<any>> = [];
    steps.forEach((recipeStep: RecipeStep) => {
      recipeStep
        .setCreated(recipe.created.getTime())
        .setLastModified(recipe.created.getTime())
        .setRecipeId(recipe.id);
      queries.push(this._saveQuery(recipeStep));
    });

    return this._db.tx("SaveRecipeSteps", (t) => {
      return t.batch(queries);
    });
  }

  public update = (steps: RecipeStep[]) => {
    const queries: Array<Promise<any>> = [];
    steps.forEach((recipeStep: RecipeStep) => {
      queries.push(this._updateQuery(recipeStep));
    });

    return this._db.tx("UpdateRecipeSteps", (t) => {
      return t.batch(queries);
    });
  }

  public get = (recipeId: Number) => {
    const query: string = `select * from recipe_steps where recipe_steps.recipeId = $1`;
    return this._db.many(query, [recipeId])
      .then((result) => {
        result.map(this._transformResult)
      })
      .catch((error) => {
        return [];
      });
  }

  public delete = (recipeId: Number) => {
    const query: string = `delete from recipe_steps where recipe_steps.recipeId = $1`;
    return this._db.none(query, [recipeId]);
  }

  private _transformResult = (result: any): RecipeStep => {
    const transformedResult: RecipeStep = new RecipeStep();
    transformedResult.id = result.hasOwnProperty("id") ? Number(result.id) : null;
    transformedResult.stepTitle = result.hasOwnProperty("title") ? result.title : null;
    transformedResult.recipeId = result.hasOwnProperty("recipeid") ? Number(result.recipeid) : null;
    transformedResult.stepDescription = result.hasOwnProperty("description") ? result.description : null;
    transformedResult.stepNumber = result.hasOwnProperty("stepnumber") ? result.stepnumber : null;
    return transformedResult;
  }
}
