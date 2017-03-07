import {
  ApiError, ERRORS
} from "./../../models/index";

export class ModelUtils {
  public updateModelValues = (existingValue: any, newValue: any ) => {
    return new Promise<any>((resolve, reject) => {
      for (const key in newValue) {
        if (existingValue.getFields().has(key)){
          existingValue.getFields().get(key).call(existingValue, newValue[key])
        } else {
          let e = new ApiError(ERRORS.UPDATE_MODEL_VALUES.withArgs(key))
            .addSource(ModelUtils.name)
            .addSourceMethod("updateModelValues(..)");
          reject(e);
        }
      }        
      resolve(existingValue);
    });
  }
}