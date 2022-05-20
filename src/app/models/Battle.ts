import moment from "moment";
import {
  Association,
  DataTypes,
  Model,
  ModelAttributes,
  Optional,
} from "sequelize";
import DatabaseManager from "../../managers/DatabaseManager";
import { BattleStatus } from "../../utils/enums";
import uuid from "uuid";
import Army from "./Army";
interface NonCreationAttribute {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: BattleStatus;
}

interface Attributes extends NonCreationAttribute {
  name: string;
  uuid: string;
}

export type BattleCreationAttribute = Optional<
  Attributes,
  keyof NonCreationAttribute
>;

export default class Battle
  extends Model<Attributes, BattleCreationAttribute>
  implements Attributes
{
  public static associations: {
    armies: Association<Battle, Army>;
  };
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
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: BattleStatus.INACTIVE,
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
  public uuid!: string;
  public status!: BattleStatus;
  public createdAt!: Date;
  public updatedAt!: Date;

  public readonly armies?: Army[];
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
export const configure = () => {
  Battle.hasMany(Army, {
    as: "armies",
    foreignKey: "battleId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};
