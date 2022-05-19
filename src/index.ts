import App from "./managers/AppManager";
import DatabaseManager from "./managers/DatabaseManager";

export const preConfigure = () => {
  DatabaseManager.instance.authenticate();
  App.listen();
};
