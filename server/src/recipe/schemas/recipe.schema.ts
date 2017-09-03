import { Schema } from "mongoose";
const ObjectId = Schema.Types.ObjectId;

export const recipeSchema = new Schema({
  description: {
    required: true,
    type: String
  },
  imageUrl: {
    type: String
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
  },
  level: {
    required: true,
    type: String
  }
},
{
  timestamps: true
});
