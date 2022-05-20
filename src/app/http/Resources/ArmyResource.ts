import moment from "moment";
import Resource from ".";
import { AttackStrategy } from "../../../utils/enums";
import Army from "../../models/Army";

export interface IArmyResource {
  units: number;
  name: string;
  originalUnits: number;
  uuid: string;
  isActive: boolean;
  attackStrategy: AttackStrategy;
  createdAt: string;
}

export default class ArmyResource implements Resource<IArmyResource> {
  constructor(private readonly army: Army) {}
  public toJSON() {
    return {
      name: this.army.name,
      units: this.army.units,
      originalUnits: this.army.originalUnits,
      uuid: this.army.uuid,
      isActive: this.army.isActive,
      attackStrategy: this.army.attackStrategy,
      createdAt: moment(this.army.createdAt).toISOString(),
    };
  }
}
