import { QueryInterface } from "sequelize";
import { battleFactory } from "../../app/factory/battleFactory";

export = {
  up: async (queryInterface: QueryInterface) => {
    const battles = battleFactory.buildList(2);
    return queryInterface.bulkInsert("Battles", battles);
  },
  down: async (queryInterface: QueryInterface) => {
    return queryInterface.bulkDelete("Battles", {});
  },
};
