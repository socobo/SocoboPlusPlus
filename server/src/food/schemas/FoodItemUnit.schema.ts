import { Schema, Types } from "mongoose";

export const foodItemUnitSchema = new Schema({
  created: {
    required: true,
    type: Number
  },
  foodItemId: {
    ref: "FoodItem",
    type: Types.ObjectId
  },
  lastModified: {
    required: true,
    type: Number
  },
  name: {
    required: true,
    type: String
  }
});
