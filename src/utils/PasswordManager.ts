import bcrypt from "bcrypt";

export default class PasswordManager {
  private static salt = 10;
  public static hash(password: string) {
    return bcrypt.hashSync(password, this.salt);
  }

  public static compare(data: string, encrypted: string) {
    return bcrypt.compareSync(data, encrypted);
  }
}
