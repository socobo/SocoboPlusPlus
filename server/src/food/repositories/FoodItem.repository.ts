import { Document, Model } from "mongoose";
import { DbError } from "../../app/index";
import { FoodItem } from "../index";

export class FoodItemRepository {

  constructor (private _model: Model<Document & FoodItem>) { }

}
