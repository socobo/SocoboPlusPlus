import { SocoboUser } from './socobouser'
import {validate, IsNotEmpty, IsNumber, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate} from "class-validator"

export class Recipe {

    public id: number;
    @IsNotEmpty()
    @Length(1, 50)
    public title: string;
    @IsNumber()
    public userId: number;
    public description: string;
    public imageUrl: string;
    private created: number;

}