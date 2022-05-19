import moment from "moment";
import { DataTypes, Model, ModelAttributes, Optional } from "sequelize";
import DatabaseManager from "../../managers/DatabaseManager";

interface NonCreationAttribute {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Attributes extends NonCreationAttribute {
  name: string;
}

export type BattleCreationAttribute = Optional<
  Attributes,
  keyof NonCreationAttribute
>;

export default class Battle
  extends Model<Attributes, BattleCreationAttribute>
  implements Attributes
{
  public static attributes: ModelAttributes<Battle, Attributes> = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      onUpdate: "CURRENT_TIMESTAMP",
    },
  };
  public id!: string;
  public name!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

export const install = () => {
  Battle.init(Battle.attributes, {
    sequelize: DatabaseManager.instance,
    createdAt: true,
    updatedAt: true,
    modelName: "Battle",
  });
  Battle.addHook("beforeCreate", (model: Battle) => {
    model.createdAt = moment.utc().toDate();
    model.updatedAt = moment.utc().toDate();
  });
};
export const configure = () => {};
