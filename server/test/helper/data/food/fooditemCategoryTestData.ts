import { FoodItemCategory } from "../../../../src/food/index";

const fooditemCategories = [
  {
    _id : "59a2f0667898dca760b01e56",
    created: 1503849392349,
    lastModified: 1503849392349,
    name: "h-milk"
  }, {
    _id : "59a2f07e5db28c0e121d48d2",
    created: 1503849392349,
    lastModified: 1503849392349,
    name: "raw milk"
  }, {
    _id : "59a2f080218278a691dc5d41",
    created: 1503849392349,
    lastModified: 1503849392349,
    name: "gen-milk"
  }, {
    _id : "5a51d4db54bafd29f86b6430",
    created: 1515312439753,
    lastModified: 1515312439753,
    name: "medium"
  }, {
    _id : "5a51d558a199eb3f69569942",
    created: 1515312519829,
    lastModified: 1515312519829,
    name: "wheat"
  }
];

export const testFooditemCategories = [
  new FoodItemCategory().clone(fooditemCategories[0] as any),
  new FoodItemCategory().clone(fooditemCategories[1] as any),
  new FoodItemCategory().clone(fooditemCategories[2] as any),
  new FoodItemCategory().clone(fooditemCategories[3] as any),
  new FoodItemCategory().clone(fooditemCategories[4] as any)
];
