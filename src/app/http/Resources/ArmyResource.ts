import moment from "moment";
import Resource from ".";
import { AttackStrategy } from "../../../utils/enums";
import Army from "../../models/Army";
import AttackResource, { IAttackResource } from "./AttackResource";

export interface IArmyResource {
  units: number;
  name: string;
  uuid: string;
  isActive: boolean;
  attackStrategy: AttackStrategy;
  createdAt: string;
  received: IAttackResource[];
  attacked: IAttackResource[];
}

export default class ArmyResource implements Resource<IArmyResource> {
  constructor(private readonly army: Army) {}
  public toJSON() {
    return {
      name: this.army.name,
      units: this.army.units,
      uuid: this.army.uuid,
      isActive: this.army.isActive,
      attackStrategy: this.army.attackStrategy,
      createdAt: moment(this.army.createdAt).toISOString(),
      received: this.army.received
        ? this.army.received.map((attack) =>
            new AttackResource(attack).toJSON()
          )
        : [],
      attacked: this.army.attacked
        ? this.army.attacked.map((attack) =>
            new AttackResource(attack).toJSON()
          )
        : [],
    };
  }
}
