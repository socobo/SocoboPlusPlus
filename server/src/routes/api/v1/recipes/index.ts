import { Router, Request, Response, NextFunction } from "express";
import { RecipeService } from "./../../../../logic/services/recipe.service";
import { ErrorUtils } from "./../../../../logic/utils/errorUtils"
import { Recipe } from "./../../../../models/recipe";
import { DbError } from "./../../../../models/db-error";
import { ApiError } from "./../../../../models/api-error";

export class RecipeRouteV1 {

    constructor(private _recipeService: RecipeService, private _router: Router) {}

    createRoutes(){
        this._router.post("/", (req: Request, res: Response) => {
            let recipe: Recipe = req.body as Recipe;
            
            this._recipeService.save(recipe)
            .then((id: any) => {
                return this._recipeService.getById(id.id);
            }).then((recipe:Recipe) => {
                res.status(200).json(recipe)
            }).catch(error => {
                res.status(500).json(new DbError('Error during adding the new recipe',
                RecipeService.name, 'save()', error).forResponse());
            })
        })

        this._router.get("/:id", (req: Request, res: Response) => {
            let recipe: Recipe = req.body as Recipe;
            let id = req.params.id;

            this._recipeService.getById(id)
            .then((result: Recipe) => {
                res.status(200).json(result);

            }).catch((error: any) => { 
                if (ErrorUtils.notFound(error)) {
                    res.status(404).json(new DbError(`The recipe for the id ${id} does not exist`,
                    RecipeService.name, 'save()', error).forResponse());
                }else{
                    res.status(500).json(new ApiError('Error during adding the new recipe',
                    RecipeService.name, 'save()', error).forResponse());
                }
            });
        })

        return this._router;
    }
}