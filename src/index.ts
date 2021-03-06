import App from "./managers/AppManager";
import CeleryManager from "./managers/CeleryManager";
import DatabaseManager from "./managers/DatabaseManager";
import RedisManager from "./managers/RedisManager";
import SocketManager from "./managers/SocketManager";

export const preConfigure = async () => {
  DatabaseManager.connect();
  RedisManager.instance;
  SocketManager.io;
  const app = new App();
  app.listen();
  CeleryManager.worker.start();
};

export const postConfig = () => {
  DatabaseManager.close();
  RedisManager.close();
};

preConfigure();

// process.on("exit", () => {
//   postConfig();
// });
