import { createWorker, createClient } from "celery-node";
import Client from "celery-node/dist/app/client";
import Worker from "celery-node/dist/app/worker";

export default class CeleryManager {
  private constructor() {}

  private static _client: Client;
  private static _worker: Worker;

  private static get redisConnectionUrl() {
    return `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
  }

  private static _initializeClient() {
    this._client = createClient(
      this.redisConnectionUrl,
      this.redisConnectionUrl
    );
  }
  private static _initializeWorker() {
    this._worker = createWorker(
      this.redisConnectionUrl,
      this.redisConnectionUrl
    );
  }

  public static get worker() {
    if (!this._worker) {
      this._initializeWorker();
    }
    return this._worker;
  }
  public static get client() {
    if (!this._client) {
      this._initializeClient();
    }
    return this._client;
  }
}
