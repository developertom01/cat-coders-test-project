import crypto from "crypto";

export default class PasswordManager {
  private static salt = crypto.randomBytes(16).toString("hex");
  public static hash(password: string) {
    return crypto.scryptSync(password, this.salt, 64).toString("utf8");
  }

  public static compare(data: string, encrypted: string) {
    return this.hash(data) === encrypted;
  }
}
