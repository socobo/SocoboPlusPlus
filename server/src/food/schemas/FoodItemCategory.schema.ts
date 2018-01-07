import { Schema } from "mongoose";

export const foodItemCategorySchema = new Schema({
  created: {
    required: true,
    type: Number
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
