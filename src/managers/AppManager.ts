import express, { Express } from "express";
import path from "path";
import fs from "fs";
import Routes from "../Routes";
import ErrorHandlerMiddleware from "../app/http/Middleware/ErrorHandlerMiddleware";
import { errors as CelebrateMiddleware } from "celebrate";
export default class App {
  private static _instance: Express;
  private static sanitizePathName(file: string) {
    return file.split(".")[0];
  }
  public static initializeModels() {
    const MODELS_PATH = path.resolve(__dirname, "../", "app", "models");
    const installers = fs
      .readdirSync(MODELS_PATH)
      .map(
        (file) => import(path.resolve(MODELS_PATH, this.sanitizePathName(file)))
      );
    Promise.all(installers).then((installer) => {
      for (const element of installer) {
        element.install();
      }
      for (const element of installer) {
        element.configure();
      }
    });
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
    this._instance.use(CelebrateMiddleware());
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
