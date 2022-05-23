import moment from "moment";
import { Op } from "sequelize";
import {
  DataTypes,
  Model,
  ModelAttributes,
  Association,
  Optional,
} from "sequelize";
import DatabaseManager from "../../managers/DatabaseManager";
import { AttackStrategy } from "../../utils/enums";
import Attack from "./Attack";
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
  originalUnits: number;
  uuid: string;
  attackStrategy: AttackStrategy;
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
    attacked: Association<Army, Attack>;
    received: Association<Army, Attack>;
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
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    attackStrategy: {
      type: DataTypes.TINYINT,
    },
    originalUnits: {
      type: DataTypes.FLOAT,
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
  public attackStrategy!: AttackStrategy;
  public originalUnits!: number;
  public uuid!: string;

  public readonly battle?: Battle;
  public readonly attacked?: Attack[];
  public readonly received?: Attack[];

  public get isActive() {
    return this.units > 0;
  }

  public async reset() {
    await this.update({
      units: this.originalUnits,
    });
  }

  public async damage() {
    if (this.units <= 0) {
      //Todo: Render inactive
      return;
    }
    if (this.units === 1) {
      await this.update({
        units: this.units - 1,
      });
    } else {
      await this.update({
        units: this.units - 0.5,
      });
    }
  }

  /**
   * This function takes an army as an argument and damages it.
   * Every unit in the army is considered as 1% chance of attack success
   * @param {Army} army - Army - the army that is being attacked
   */
  private async attack(army: Army) {
    if (parseInt(army.id) !== parseInt(this.id) && army.units > 0) {
      const damaged = !!Math.round(Math.random() * this.units * 0.01);
      if (damaged) {
        await army.damage();
      }
      await Attack.create({
        attackerId: this.id,
        battleId: this.battleId,
        isSuccessfully: damaged,
        receiverId: army.id,
        strategy: this.attackStrategy,
      });
    }
  }

  public async fight() {
    if (this.attackStrategy === AttackStrategy.RANDOM_ATTACK) {
      await this.randomAttack();
    } else if (this.attackStrategy === AttackStrategy.STRONG_ATTACK) {
      await this.strongAttack();
    } else {
      this.weekAttack();
    }
  }

  /**
   * Attack the army with the most units in the same battle."
   */
  public async strongAttack() {
    await this.reload({
      include: [
        {
          association: Army.associations.battle,
          include: [
            {
              association: Battle.associations.armies,
              // where: {
              //   id: {
              //     [Op.not]: this.id,
              //     units: {
              //       [Op.gt]: 0,
              //     },
              //   },
              // },
            },
          ],
        },
      ],
    });
    const army = this.battle!.armies!.reduce((prev, cur) =>
      prev.units > cur.units ? prev : cur
    );
    await this.attack(army);
  }
  /**
   * "Attack the army with the least units in the same battle as this army."
   */
  public async weekAttack() {
    await this.reload({
      include: [
        {
          association: Army.associations.battle,
          include: [
            {
              association: Battle.associations.armies,
              where: {
                // id: {
                //   [Op.not]: this.id,
                //   units: {
                //     [Op.gt]: 0,
                //   },
                //   require: false,
                // },
              },
            },
          ],
        },
      ],
    });
    const army = this.battle!.armies!.reduce((prev, cur) =>
      prev.units < cur.units ? prev : cur
    );
    await this.attack(army);
  }
  /**
   * "Find all the armies in the same battle as this army, and attack one of them at random."
   *
   */
  public async randomAttack() {
    await this.reload({
      include: [
        {
          association: Army.associations.battle,
          include: [
            {
              association: Battle.associations.armies,
              // where: {
              //   id: {
              //     [Op.not]: this.id,
              //     units: {
              //       [Op.gt]: 0,
              //     },
              //   },
              // },
            },
          ],
        },
      ],
    });

    const army =
      this.battle!.armies![Math.random() * this.battle!.armies!.length - 1];
    if (army) {
      this.attack(army);
    }
  }
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
  Army.hasMany(Attack, {
    as: "attacked",
    foreignKey: "attackerId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Army.hasMany(Attack, {
    as: "received",
    foreignKey: "receiverId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};
