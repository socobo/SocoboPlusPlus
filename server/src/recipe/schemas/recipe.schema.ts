import { Schema } from "mongoose";
const ObjectId = Schema.Types.ObjectId;

export const recipeSchema = new Schema({
  categoryId: {
    ref: "RecipeCategories",
    type: ObjectId
  },
  collaborators: {
    required: false,
    type: [String]
  },
  description: {
    required: true,
    type: String
  },
  duration: {
    required: false,
    type: Number
  },
  images: [
    {
      title: String,
      url: String
    }
  ],
  ingredients: [String],
  level: {
    required: false,
    type: String
  },
  owner: String,
  readers: {
    required: false,
    type: [String]
  },
  steps: [
    {
      stepDescription: String,
      stepNumber: Number,
      stepTitle: String
    }
  ],
  title: {
    required: true,
    type: String
  },
  userId: {
    ref: "SocoboUser",
    type: ObjectId
  }
},
{
  timestamps: true
});
