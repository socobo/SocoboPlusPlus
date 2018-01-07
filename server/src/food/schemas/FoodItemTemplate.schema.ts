import { Schema } from "mongoose";

export const foodItemTemplateSchema = new Schema({
  categoryIds: [{
    ref: "FoodItemCategory",
    type: Schema.Types.ObjectId
  }],
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
  },
  unitId: {
    ref: "FoodItemUnit",
    type: Schema.Types.ObjectId
  }
});
