// import DatabaseManager from "../managers/DatabaseManager";
import dotenv from "dotenv";

dotenv.config();
import App from "../managers/AppManager";
import DatabaseManager from "../managers/DatabaseManager";

beforeEach(async () => {
  App.initializeModels();
});
afterEach(() => {
  DatabaseManager.instance.close();
});
