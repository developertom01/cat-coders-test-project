import express, { Express } from "express";
import path from "path";
import fs from "fs";
import Routes from "../Routes";
import ErrorHandlerMiddleware from "../app/http/Middleware/ErrorHandlerMiddleware";
import { errors as CelebrateMiddleware } from "celebrate";
import http from "http";
import SocketManager from "./SocketManager";

export default class App {
  private _instance: Express;
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
  constructor() {
    if (!process.env.APP_SECRETE) {
      throw new Error("Must provide application's secrete");
    }
    this._instance = express();
    App.initializeModels();

    this._instance.use(express.json());
    this._instance.use("/api/v1", Routes);
    //Should be the last middleware
    this._instance.use("*", (req, res) => {
      res.status(404).send("No route");
    });
    this._instance.use(CelebrateMiddleware());
    this._instance.use(ErrorHandlerMiddleware);
  }
  public instance() {
    return this._instance;
  }
  public listen() {
    const httpServer = http.createServer(this._instance);
    SocketManager.initialize(httpServer);
    const port = parseInt(process.env.PORT!);
    httpServer.listen(port, () => {
      if (process.env.NODE_ENV === "development") {
        console.log(`App started on http://localhost:${port}`);
      }
    });
  }
}
