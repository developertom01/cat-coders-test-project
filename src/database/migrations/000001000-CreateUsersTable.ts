import { QueryInterface } from "sequelize/types";
import User from "../../app/models/User";

export = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable<User>("Users", User.attributes);
  },
  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("Users");
  },
};
