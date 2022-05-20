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
    originalUnits: {
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
  public originalUnits!: number;
  public uuid!: string;

  public readonly battle?: Battle;

  public async reset() {
    await this.update({
      units: this.originalUnits,
    });
  }

  private async damage() {
    await this.update({
      units: this.units - 1,
    });
  }

  private async attack(army: Army) {
    let curInit = this.units;
    while (curInit > 0) {
      const damaged = Math.round(Math.random());
      if (damaged) {
        await army.damage();
        return;
      }
      curInit = curInit - 1;
    }
  }

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
                  require: false,
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
                  require: false,
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
                  require: false,
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
