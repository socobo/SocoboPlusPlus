export class FoodItem {
  public id: number;
  public name: string;
  public unit: string;

  public addName (name: string) {
    this.name = name;
  }

  public addUnit (unit: string) {
    this.unit = unit;
  }
}
