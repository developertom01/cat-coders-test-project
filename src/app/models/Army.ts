import moment from "moment";
import {
  DataTypes,
  Model,
  ModelAttributes,
  Association,
  Optional,
} from "sequelize";
import DatabaseManager from "../../managers/DatabaseManager";
import Battle from "./Battle";

interface NonCreationAttribute {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  units: number;
}

interface Attributes extends NonCreationAttribute {
  name: string;
  battleId: string;
  uuid: string;
}
export type AmyCreationAttribute = Optional<
  Attributes,
  keyof NonCreationAttribute
>;

export default class Army
  extends Model<Attributes, AmyCreationAttribute>
  implements Attributes
{
  public static associations: {
    battle: Association<Army, Battle>;
  };
  public static attributes: ModelAttributes<Army> = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    battleId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "Battles",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    units: {
      type: DataTypes.INTEGER,
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
  public battleId!: string;
  public name!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public units!: number;
  public uuid!: string;

  public readonly battle?: Battle;
}
export const install = () => {
  Army.init(Army.attributes, {
    sequelize: DatabaseManager.instance,
    createdAt: true,
    updatedAt: true,
    modelName: "Army",
  });
  Army.addHook("beforeCreate", (model: Army) => {
    model.createdAt = moment.utc().toDate();
    model.updatedAt = moment.utc().toDate();
  });
};
export const configure = () => {
  Army.belongsTo(Battle, {
    as: "battle",
    foreignKey: "battleId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};
