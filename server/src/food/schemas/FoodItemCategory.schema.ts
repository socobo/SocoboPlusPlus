import { Schema } from "mongoose";

export const foodItemCategorySchema = new Schema({
  created: {
    required: true,
    type: Number
  },
  foodItemId: {
    ref: "FoodItem",
    type: Schema.Types.ObjectId
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
