export class SocoboUser {
  id: number;
  username: string;
  email: string;
  password: string;
  image: string;
  hasTermsAccepted: boolean;
  isAdmin: boolean;
  provider: string;

  forSigning (): Object {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      isAdmin: this.isAdmin
    };
  }
}