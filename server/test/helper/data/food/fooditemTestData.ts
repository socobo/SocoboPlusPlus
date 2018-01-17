import { FoodItem } from "../../../../src/food/index";

const foodItems = [
  {
    _id : "59a2ef66b9c6c5139160b4d8",
    amount: 3.0,
    bestBefore: 1501948817400,
    created: 1503849392349,
    foodItemTemplateId: "59a2eea98a5a150e9e829409",
    lastModified: 1503849392349,
    socoboUserId: "59a2ee598ae9b7b45243d503"
  }, {
    _id : "59a2ef67abc417f4a99d55fc",
    amount: 4.0,
    bestBefore: 1501948817400,
    created: 1503849392349,
    foodItemTemplateId: "59a2eeaaf11f5c403eeb6d06",
    lastModified: 1503849392349,
    socoboUserId: "59a2ee598ae9b7b45243d503"
  }, {
    _id : "59a2ef68310b123d61063301",
    amount: 1.0,
    bestBefore: 1501948817400,
    created: 1503849392349,
    foodItemTemplateId: "59a2eeaaf09a4c43cb92ef0b",
    lastModified: 1503849392349,
    socoboUserId: "59a2ee5be2c06ab513940b84"
  }
];

export const testFoodItems = [
  new FoodItem().clone(foodItems[0] as any),
  new FoodItem().clone(foodItems[1] as any),
  new FoodItem().clone(foodItems[2] as any)
];
