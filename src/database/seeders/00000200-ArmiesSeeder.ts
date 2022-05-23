import { QueryInterface } from "sequelize";
import { armyFactory } from "../../app/factory/battleFactory";

export = {
  up: async (queryInterface: QueryInterface) => {
    const armies = armyFactory.buildList(200);
    return queryInterface.bulkInsert("Armies", armies);
  },
  down: async (queryInterface: QueryInterface) => {
    return queryInterface.bulkDelete("Armies", {});
  },
};
