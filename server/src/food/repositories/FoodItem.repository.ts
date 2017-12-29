import { Document, Model } from "mongoose";
import { FoodItem } from "../index";

export class FoodItemRepository {

  constructor (private _model: Model<Document & FoodItem) { }
}
