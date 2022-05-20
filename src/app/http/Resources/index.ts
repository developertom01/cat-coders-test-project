export default abstract class Resource<T> {
  public abstract toJSON: () => T;
}
