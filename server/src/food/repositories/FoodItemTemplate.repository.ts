import { Document, Model } from "mongoose";
import { FoodItemTemplate } from "../index";

export class FoodItemTemplateRepository {

  constructor (private _fooditemTemplateModel: Model<Document & FoodItemTemplate>) {}

}
