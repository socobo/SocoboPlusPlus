export class ExtractRequestBodyResult {

  constructor (
    public isEmailLogin: boolean,
    public usernameOrEmail: string,
    public password: string
  ) {}
}
