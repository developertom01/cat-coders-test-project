import { QueryInterface } from "sequelize/types";
import Army from "../../app/models/Army";

export = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable<Army>("Armies", Army.attributes);
  },
  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("Armies");
  },
};
