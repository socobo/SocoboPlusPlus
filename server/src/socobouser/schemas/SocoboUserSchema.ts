import { Schema } from "mongoose";

export const socoboUserSchema = new Schema({
  created: {
    required: true,
    type: Number
  },
  email: {
    type: String
  },
  hasTermsAccepted: {
    type: Boolean
  },
  imageUrl: {
    type: String
  },
  lastModified: {
    required: true,
    type: Number
  },
  password: {
    required: true,
    type: String
  },
  provider: {
    type: String
  },
  role: {
    type: String
  },
  username: {
    type: String
  }
});
