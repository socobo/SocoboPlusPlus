import { FoodItemTemplate } from "../../../../src/food/index";

const fooditemTemplates = [
  {
    _id : "59a2eea98a5a150e9e829409",
    categoryIds: [
      "59a2f0667898dca760b01e56",
      "59a2f080218278a691dc5d41"
    ],
    created: 1503849392349,
    lastModified: 1503849392349,
    name: "milk",
    unitId: "59a2f14eae4fedd7d86f2d9b"
  }, {
    _id : "59a2eeaaf11f5c403eeb6d06",
    categoryIds: [
      "5a51d4db54bafd29f86b6430"
    ],
    created: 1503849392349,
    lastModified: 1503849392349,
    name: "water",
    unitId: "59a2f14eae4fedd7d86f2d9b"
  }, {
    _id : "59a2eeaaf09a4c43cb92ef0b",
    categoryIds: [
      "5a51d558a199eb3f69569942"
    ],
    created: 1503849392349,
    lastModified: 1503849392349,
    name: "bread",
    unitId: "59dbb22f96a13f5f8bb65914"
  }
];

export const testFooditemTemplates = [
  new FoodItemTemplate().clone(fooditemTemplates[0] as any),
  new FoodItemTemplate().clone(fooditemTemplates[1] as any),
  new FoodItemTemplate().clone(fooditemTemplates[2] as any)
];
