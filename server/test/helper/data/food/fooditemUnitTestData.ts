import { FoodItemUnit } from "../../../../src/food/index";

const fooditemUnits = [
  {
    _id : "59a2f14d7f4daed7367bc676",
    created: 1503849392349,
    lastModified: 1503849392349,
    name: "litre"
  }, {
    _id : "59a2f14eae4fedd7d86f2d9b",
    created: 1503849392349,
    lastModified: 1503849392349,
    name: "millilitre"
  }, {
    _id : "59dbb22f96a13f5f8bb65914",
    created: 1503849392349,
    lastModified: 1503849392349,
    name: "gramm"
  }
];

export const testFooditemUnits = [
  new FoodItemUnit().clone(fooditemUnits[0] as any),
  new FoodItemUnit().clone(fooditemUnits[1] as any),
  new FoodItemUnit().clone(fooditemUnits[2] as any)
];
