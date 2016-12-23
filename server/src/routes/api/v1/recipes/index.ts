import { Router, Request, Response, NextFunction } from "express";
import { RecipeService } from "./../../../../logic/services/recipe.service";
import { Recipe } from "./../../../../models/recipe";
import { BackendError } from "./../../../../models/backenderror";

export class RecipeRouteV1 {

    constructor(private _recipeService: RecipeService, private _router: Router) {}

    createRoutes(){
        this._router.post("/", (req: Request, res: Response, next: NextFunction) => {
            let recipe: Recipe = new Recipe("TEST");
            this._recipeService.save(recipe).then(function (id: number) {
                res.status(200).json(id);
            }).catch(function (error: any) { 
                console.log(error);
                res.status(500).json(new BackendError("Error during adding the new recipe", error));
            });
        })

        return this._router;
    }
}