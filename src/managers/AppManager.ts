import express, { Express } from "express";
import path from "path";
import fs from "fs";

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
    this._instance = express();
    this.initializeModels();
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
    const port = process.env.PORT ?? 3000;
    this._instance.listen(port, () => {
      if (process.env.NODE_ENV === "development") {
        console.log(`App started on http://localhost:${port}`);
      }
    });
  }
}
