import { QueryInterface } from "sequelize/types";
import Attack from "../../app/models/Attack";

export = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable<Attack>("Attacks", Attack.attributes);
  },
  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("Attacks");
  },
};
