import { Schema } from "mongoose";
const ObjectId = Schema.Types.ObjectId;

export const recipeIngredientSchema = new Schema({
  amount: {
    required: true,
    type: Number
  },
  fooditemTemplateId: {
    ref: "FoodItemTemplate",
    type: ObjectId
  }
},
{
  timestamps: true
});
