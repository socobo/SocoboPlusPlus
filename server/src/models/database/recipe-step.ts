export class RecipeStep {
  public id: number;
  public step: number;
  public description: string;

  public addStep (step: number) {
    this.step = step;
  }

  public addDescription (description: string) {
    this.description = description;
  }
}
