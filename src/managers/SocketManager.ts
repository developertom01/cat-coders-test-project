import { Server } from "socket.io";
import { createServer } from "http";
import App from "./AppManager";
import RedisManager from "./RedisManager";
import { createAdapter } from "@socket.io/redis-adapter";

export default class SocketManager {
  private static _io: Server;
  private static initialize() {
    const httpServer = createServer(App.instance);
    this._io = new Server(httpServer);
    //Add adopters
    const pubClient = RedisManager.instance;
    const subClient = pubClient.duplicate();
    this._io.adapter(createAdapter(pubClient, subClient));
    //Add middleware
  }
  public static get io() {
    if (!this._io) {
      this.initialize();
    }
    return this._io;
  }
}
