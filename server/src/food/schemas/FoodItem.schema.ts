import { Schema } from "mongoose";

export const foodItemSchema = new Schema({
  amount: {
    required: true,
    type: Number
  },
  bestBefore: {
    required: true,
    type: Number
  },
  created: {
    required: true,
    type: Number
  },
  foodItemTemplateId: {
    ref: "FoodItemTemplate",
    type: Schema.Types.ObjectId
  },
  lastModified: {
    required: true,
    type: Number
  },
  socoboUserId: {
    ref: "SocoboUser",
    type: Schema.Types.ObjectId
  }
});
