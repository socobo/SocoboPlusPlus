import { ApiError, ERRORS, Recipe } from "./../../models/index";

export class ModelUtils {
  public updateModelValues = (existingValue: Recipe, newValue: any ) => {
    return new Promise<any>((resolve, reject) => {
      for (const key in newValue) {
        if (existingValue.fields.has(key)) {
          existingValue.fields.get(key).call(existingValue, newValue[key]);
        } else {
          const e = new ApiError(ERRORS.UPDATE_MODEL_VALUES.withArgs(key))
            .addSource(ModelUtils.name)
            .addSourceMethod("updateModelValues(..)");
          reject(e);
        }
      }
      resolve(existingValue);
    });
  }
}