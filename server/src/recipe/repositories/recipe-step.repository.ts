import { IDatabase } from "pg-promise";
import { DbExtensions } from "../../app/index";
import { Recipe, RecipeStep } from "../index";

export class RecipeStepRepository {

  private _db: IDatabase<DbExtensions>&DbExtensions;

  constructor (db: any) {
    this._db = db;
  }

  public get = (recipeId: Number) => {
    const query: string = `select * from recipe_steps where recipe_steps.recipeId = $1`;
    return this._db.many(query, [recipeId])
      .then((result) => result.map(this._transformResult))
      .catch((error) => []);
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

  private _saveQuery = (step: RecipeStep) => {
    const query: string = `insert into recipe_steps(title, description, stepNumber, recipeId)
                           values($1, $2, $3, $4)
                           returning id`;
    return this._db.one(query, [step.stepTitle, step.stepDescription, step.stepNumber, step.recipeId]);
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

  private _updateQuery = (step: RecipeStep) => {
    const query: string = `update recipe_steps set
                             title=$2, description=$3, stepNumber=$4
                           where recipe_steps.id=$1`;
    return this._db.none(query, [step.id, step.stepTitle, step.stepDescription, step.stepNumber]);
  }

  public delete = (recipeId: Number) => {
    const query: string = `delete from recipe_steps where recipe_steps.recipeId = $1`;
    return this._db.none(query, [recipeId]);
  }

  private _transformResult = (result: any): RecipeStep => {
    const transformedResult: RecipeStep = new RecipeStep()
      .setId(result.hasOwnProperty("id") ? Number(result.id) : null)
      .setTitle(result.hasOwnProperty("title") ? result.title : null)
      .setRecipeId(result.hasOwnProperty("recipeid") ? Number(result.recipeid) : null)
      .setDescription(result.hasOwnProperty("description") ? result.description : null)
      .setStep(result.hasOwnProperty("stepnumber") ? result.stepnumber : null);
    return transformedResult;
  }
}
