import { Schema } from "mongoose";

export const foodItemSchema = new Schema({
  created: {
    required: true,
    type: Number
  },
  lastModified: {
    required: true,
    type: Number
  }
});
