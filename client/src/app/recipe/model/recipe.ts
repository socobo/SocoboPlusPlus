export class Recipe {

  constructor (
    public id: number,
    public title: string,
    public description: string,
    public created: Date,
    public modified: Date
    ) {}

}