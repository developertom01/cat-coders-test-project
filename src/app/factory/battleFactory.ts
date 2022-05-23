import { Factory } from "fishery";
import { BattleCreationAttribute } from "../models/Battle";
import faker from "@faker-js/faker";
import { v4 as uuidV4 } from "uuid";
import { AmyCreationAttribute } from "../models/Army";
import { BattleStatus } from "../../utils/enums";
import moment from "moment";

export const battleFactory = Factory.define<BattleCreationAttribute>(() => ({
  name: faker.random.word(),
  uuid: uuidV4(),
  status: BattleStatus.INACTIVE,
  createdAt: moment().toDate(),
  updatedAt: moment().toDate(),
}));

export const armyFactory = Factory.define<AmyCreationAttribute>(() => ({
  name: faker.random.word(),
  uuid: uuidV4(),
  battleId: Math.floor(Math.random() + 1).toString(),
  attackStrategy: Math.floor(Math.random() * 2),
  originalUnits: 95,
  units: 95,
  createdAt: moment().toDate(),
  updatedAt: moment().toDate(),
}));
