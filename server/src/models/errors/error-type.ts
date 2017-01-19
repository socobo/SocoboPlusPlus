export class ErrorType {
  public messageArgs: string[] = [];

  constructor (
    public code: string,
    public messageKey: string,
    public statusCode: number
  ) { }

  public withArgs (...args: string[]): ErrorType {
    this.messageArgs = args;
    return this;
  }
}
