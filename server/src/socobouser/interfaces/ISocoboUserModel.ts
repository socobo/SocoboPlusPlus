import { Document } from "mongoose";
import { Validatable } from "../../app/index";
import { SocoboUser } from "../index";

export interface ISocoboUserModel extends Document, SocoboUser {}
