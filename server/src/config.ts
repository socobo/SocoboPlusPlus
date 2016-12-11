export class Config {
  static DB_USER: string = "postgres";
  static DB_PW: string = "socobo";
  static DATABASE_URL: string = `postgres://${Config.DB_USER}:${Config.DB_PW}@localhost:5432/socobo?ssl=false`;
  static PORT: number = 8282;
}