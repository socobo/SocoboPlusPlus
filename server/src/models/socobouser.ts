export class SocoboUser {
  id: number;
  username: string;
  email: string;
  password: string;
  hasTermsAccepted: boolean;
  isAdmin: boolean;
  provider: string;
}