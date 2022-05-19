import { Sequelize } from "sequelize";

export default class DatabaseManager {
  private static _instance: Sequelize;
  private static _initialize() {
    this._instance = new Sequelize({
      dialect: "mariadb",
      database: "dev",
      host: process.env.DATABASE_HOST,
      password: process.env.DATABASE_PASSWORD,
      username: process.env.DATABASE_USER,
    });
  }
  public static get instance() {
    if (!this._instance) {
      this._initialize();
    }
    return this._instance;
  }
  public static close() {
    this._instance.close();
  }
}
