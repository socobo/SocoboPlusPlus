import { NextFunction, Request, Response } from "express";
import {
  ERRORS, SocoboRequest, ValidationError
} from "../../app/index";

export class RecipeMiddleware {
  public checkTitle = async (req: SocoboRequest, res: Response, next: NextFunction) => {
    const imageTitle = req.query.title;
    if (!imageTitle || !req.file.filename) {
      const error = new ValidationError(ERRORS.RECIPE_NO_IMAGE_TITLE)
        .addSourceMethod("uploadImage()")
        .addSource(RecipeMiddleware.name);
      res.status(400).json(error.forResponse());
    }else {
      next();
    }
  }
}
