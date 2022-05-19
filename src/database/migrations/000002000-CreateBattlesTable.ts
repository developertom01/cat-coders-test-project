import { QueryInterface } from "sequelize/types";
import Battle from "../../app/models/Battle";

export = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable<Battle>("Battles", Battle.attributes);
  },
  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("Battles");
  },
};
