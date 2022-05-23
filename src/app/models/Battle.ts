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
import Army from "./Army";
import Attack from "./Attack";
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
    attacks: Association<Battle, Attack>;
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
  public readonly attacks?: Attack[];

  public get isDone() {
    return this.armies!.filter((army) => army.isActive).length <= 1;
  }

  public async begin() {
    console.log("Has began");
    await this.reload({ include: [Battle.associations.armies] });
    let isOngoing = true;
    while (isOngoing) {
      console.log("Has began BATTLE1 ---------");
      const promises: Promise<void>[] = [];
      for (const army of this.armies!) {
        if (army.isActive) {
          promises.push(army.fight());
        }
      }
      await Promise.all(promises);
      await this.reload({ include: [Battle.associations.armies] });
      if (this.isDone) {
        isOngoing = false;
        await this.update({
          status: BattleStatus.INACTIVE,
        });
      } else {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve(null);
          }, 100);
        });
      }
    }
  }

  // public async reset() {
  //   await Promise.all([
  //     this.reload({ include: [Battle.associations.armies] }),
  //     Attack.destroy({ where: { battleId: this.id } }),
  //   ]);
  //   const promises: Promise<void>[] = [];
  //   for (const army of this.armies!) {
  //     promises.push(army.reset());
  //   }
  //   const newPromise = this.update({ status: BattleStatus.INACTIVE });
  //   await Promise.all([...promises, newPromise]);
  // }
  public async reset() {
    await Promise.all([
      this.reload({ include: [Battle.associations.armies] }),
      Attack.destroy({ where: { battleId: this.id } }),
    ]);
    const promises: Promise<void>[] = [];
    for (const army of this.armies!) {
      promises.push(army.reset());
    }
    const newPromise = this.update({ status: BattleStatus.INACTIVE });
    await Promise.all([...promises, newPromise]);
  }
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
  Battle.hasMany(Attack, {
    as: "attacks",
    foreignKey: "battleId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};
