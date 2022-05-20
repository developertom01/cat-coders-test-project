import { Server } from "socket.io";
import http from "http";
import RedisManager from "./RedisManager";
import { createAdapter } from "@socket.io/redis-adapter";

export default class SocketManager {
  private static _io: Server;
  public static initialize(server: http.Server) {
    this._io = new Server(server);
    //Add adopters
    const pubClient = RedisManager.instance;
    const subClient = pubClient.duplicate();
    this._io.adapter(createAdapter(pubClient, subClient));
    //Add middleware
  }
  public static get io() {
    return this._io;
  }
}
