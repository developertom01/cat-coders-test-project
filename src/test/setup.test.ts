import DatabaseManager from "../managers/DatabaseManager";

beforeEach(async () => {
  await DatabaseManager.instance.authenticate();
});
afterEach(() => {
  DatabaseManager.close();
});
