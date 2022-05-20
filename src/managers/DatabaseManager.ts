import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();
export default class DatabaseManager {
  private static _instance: Sequelize;
  private static _initialize() {
    this._instance = new Sequelize({
      dialect: "mysql",
      database: process.env.DATABASE_NAME,
      host: process.env.DATABASE_HOST,
      password: process.env.DATABASE_PASSWORD,
      username: "root",
      port: Number(process.env.DATABASE_PORT!),
      logging: false,
    });
  }
  public static connect() {
    if (!this._instance) {
      this._initialize();
    }
    this.instance.authenticate().catch((error) => {
      console.log(error);

      console.log("Database connection failed");
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
