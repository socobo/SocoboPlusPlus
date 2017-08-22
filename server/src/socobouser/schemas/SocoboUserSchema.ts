import { Schema } from "mongoose";

export const SocoboUserSchema = new Schema({
  username: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String,
    required: true
  },
  hasTermsAccepted: {
    type: Boolean
  },
  role: {
    type: String
  },
  provider: {
    type: String
  },
  imageUrl: {
    type: String
  },
  created: {
    type: Number,
    required: false
  },
  lastModified: {
    type: Number,
    required: false
  }
});
