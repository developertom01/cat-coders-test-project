import App from "./managers/AppManager";
import DatabaseManager from "./managers/DatabaseManager";
import RedisManager from "./managers/RedisManager";
import SocketManager from "./managers/SocketManager";

export const preConfigure = async () => {
  DatabaseManager.instance.authenticate().catch(() => {
    console.log("Database connection failed");
  });
  RedisManager.instance;
  SocketManager.io;
  App.listen();
};

export const postConfig = () => {
  DatabaseManager.close();
  RedisManager.close();
};

preConfigure();

// process.on("exit", () => {
//   postConfig();
// });
