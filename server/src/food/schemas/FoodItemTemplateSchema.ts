import { Schema } from "mongoose";

export const foodItemTemplateSchema = new Schema({
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
