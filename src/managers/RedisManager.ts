import { createClient, RedisClientType } from "redis";

export default class RedisManager {
  private constructor() {}
  private static _instance: RedisClientType;

  private static _initialize() {
    this._instance = createClient({
      password: process.env.REDIS_PASSWORD,
      username: process.env.REDIS_USER,
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    });
    this.instance.connect().then(() => {
      if (process.env.NODE_ENV === "development") {
        console.log("Initialized redis manager");
      }
    });
    this.instance.on("error", () => {});
  }
  public static get instance() {
    if (!this._instance) {
      this._initialize();
    }
    return this._instance;
  }
  public static close() {
    this._instance.disconnect();
  }
}
