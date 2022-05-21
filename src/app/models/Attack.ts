import { AttackStrategy } from "../../utils/enums";
import {
  DataTypes,
  Model,
  ModelAttributes,
  Association,
  Optional,
} from "sequelize";
import DatabaseManager from "../../managers/DatabaseManager";
import moment from "moment";
import Battle from "./Battle";
import Army from "./Army";

interface NonCreationAttribute {
  id: string;
  createdAt: Date;
}

interface Attributes extends NonCreationAttribute {
  strategy: AttackStrategy;
  isSuccessfully: boolean;
  attackerId: string;
  receiverId: string;
  battleId: string;
}

export type AttackCreationAttributes = Optional<
  Attributes,
  keyof NonCreationAttribute
>;

export default class Attack
  extends Model<Attributes, AttackCreationAttributes>
  implements Attributes
{
  public static associations: {
    battle: Association<Attack, Battle>;
    attacker: Association<Attack, Army>;
    receiver: Association<Attack, Army>;
  };
  public static attributes: ModelAttributes<Attack, Attributes> = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    strategy: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    isSuccessfully: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    attackerId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "Armies",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    receiverId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "Armies",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  };

  public strategy!: AttackStrategy;
  public isSuccessfully!: boolean;
  public attackerId!: string;
  public receiverId!: string;
  public battleId!: string;
  public id!: string;
  public createdAt!: Date;

  public readonly battle?: Battle;
  public readonly attacker?: Army;
  public readonly receiver?: Army;
}

export const install = () => {
  Attack.init(Attack.attributes, {
    sequelize: DatabaseManager.instance,
    createdAt: true,
    updatedAt: false,
    modelName: "Attack",
  });
  Attack.addHook("beforeCreate", (model: Attack) => {
    model.createdAt = moment.utc().toDate();
  });
};
export const configure = () => {
  Attack.belongsTo(Battle, {
    as: "battle",
    foreignKey: "battleId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Attack.belongsTo(Army, {
    as: "attacker",
    foreignKey: "attackerId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Attack.belongsTo(Army, {
    as: "receiver",
    foreignKey: "receiverId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};
