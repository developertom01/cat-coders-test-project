// import DatabaseManager from "../managers/DatabaseManager";
import dotenv from "dotenv";
require("iconv-lite").encodingExists("foo");

dotenv.config();
import App from "../managers/AppManager";
import DatabaseManager from "../managers/DatabaseManager";

beforeEach(async () => {
  const db = DatabaseManager.instance;
  db.authenticate().catch((err) => {
    console.log("Db could not authenticate");
  });

  App.initializeModels();
});
afterEach(() => {});
