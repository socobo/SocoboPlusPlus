import { IsNotEmpty, IsNumber, Length } from "class-validator"
import { SocoboUser } from './socobouser'

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