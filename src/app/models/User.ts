import moment from "moment";
import { Optional, Model, ModelAttributes, DataTypes } from "sequelize";
import DatabaseManager from "../../managers/DatabaseManager";
import PasswordManager from "../../utils/PasswordManager";

interface NonCreationAttribute {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Attributes extends NonCreationAttribute {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

export type UserCreationAttribute = Optional<
  Attributes,
  keyof NonCreationAttribute
>;

export default class User
  extends Model<Attributes, UserCreationAttribute>
  implements Attributes
{
  public static attributes: ModelAttributes<User, Attributes> = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: false,
      autoIncrement: true,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
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
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public username!: string;
  public password!: string;
  public id!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  public authenticated(password: string) {
    return PasswordManager.compare(password, this.password);
  }
}

export const install = () => {
  User.init(User.attributes, {
    sequelize: DatabaseManager.instance,
    createdAt: true,
    updatedAt: true,
    modelName: "User",
  });
  User.addHook("beforeCreate", (model: User) => {
    model.createdAt = moment.utc().toDate();
    model.updatedAt = moment.utc().toDate();
    model.password = PasswordManager.hash(model.password);
  });
};
export const configure = () => {};
