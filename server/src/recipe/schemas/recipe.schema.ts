import { Schema } from "mongoose";
const ObjectId = Schema.Types.ObjectId;

export const recipeSchema = new Schema({
  description: {
    required: true,
    type: String
  },
  images: [
    {
      url: String,
      title: String
    }
  ],
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
  },
  duration: {
    required: false,
    type: Number
  }
},
{
  timestamps: true
});
