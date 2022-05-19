import express, { Express } from "express";
import path from "path";
import fs from "fs";
import Routes from "../Routes";
import ErrorHandlerMiddleware from "../app/http/Middleware/ErrorHandlerMiddleware";
export default class App {
  private static _instance: Express;
  private static sanitizePathName(file: string) {
    return file.split(".")[0];
  }
  private static initializeModels() {
    const MODELS_PATH = path.resolve(__dirname, "../", "app", "models");
    for (const file of fs.readdirSync(MODELS_PATH)) {
      import(path.resolve(MODELS_PATH, this.sanitizePathName(file))).then(
        (model) => {
          model.install();
          model.configure();
        }
      );
    }
  }
  private static _initialize() {
    if (!process.env.APP_SECRETE) {
      throw new Error("Must provide application's secrete");
    }
    this.initializeModels();
    this._instance = express();
    this.instance.use(express.json());
    this._instance.use("/api/v1", Routes);

    //Should be the last middleware
    this._instance.use(ErrorHandlerMiddleware);
  }
  public static get instance() {
    if (!this._instance) {
      this._initialize();
    }
    return this._instance;
  }
  public static listen() {
    if (!this._instance) {
      this._initialize();
    }
    const port = parseInt(process.env.PORT!);
    this._instance.listen(port, () => {
      if (process.env.NODE_ENV === "development") {
        console.log(`App started on http://localhost:${port}`);
      }
    });
  }
}
