import { Schema } from "mongoose";
const ObjectId = Schema.Types.ObjectId;

export const recipeCategorySchema = new Schema({
  description: {
    required: false,
    type: String
  },
  title: {
    required: true,
    type: String
  }
},
{
  timestamps: true
});
