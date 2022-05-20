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
    const damaged = Math.round(Math.random() * this.units * 0.01);
    if (damaged) {
      await army.damage();
    }
  }

  /**
   * Attack the army with the most units in the same battle."
   */
  public async strongAttack() {
    let armies = await this.reload({
      include: [
        {
          association: Army.associations.battle,
          include: [
            {
              association: Battle.associations.armies,
              where: {
                id: {
                  [Op.not]: this.id,
                },
              },
            },
          ],
        },
      ],
    });
    const army = armies.battle!.armies!.reduce((prev, cur) =>
      prev.units > cur.units ? prev : cur
    );
    await this.attack(army);
  }
  /**
   * "Attack the army with the least units in the same battle as this army."
   */
  public async weekAttack() {
    let armies = await this.reload({
      include: [
        {
          association: Army.associations.battle,
          include: [
            {
              association: Battle.associations.armies,
              where: {
                id: {
                  [Op.not]: this.id,
                },
              },
            },
          ],
        },
      ],
    });
    const army = armies.battle!.armies!.reduce((prev, cur) =>
      prev.units < cur.units ? prev : cur
    );
    await this.attack(army);
  }
  /**
   * "Find all the armies in the same battle as this army, and attack one of them at random."
   *
   */
  public async randomAttack() {
    let armies = await this.reload({
      include: [
        {
          association: Army.associations.battle,
          include: [
            {
              association: Battle.associations.armies,
              where: {
                id: {
                  [Op.not]: this.id,
                },
              },
            },
          ],
        },
      ],
    });
    const army =
      armies.battle!.armies![Math.random() * armies.battle!.armies!.length - 1];
    this.attack(army);
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
};
