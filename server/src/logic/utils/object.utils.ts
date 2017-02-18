export class ObjectUtils {

  public static createFromPOJO<T> (type: { new (): T }, pojo: Object): T {
    return Object.assign(new type(), pojo);
  }
}
