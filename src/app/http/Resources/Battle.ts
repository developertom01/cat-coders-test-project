import Resource from ".";
import { BattleStatus } from "../../../utils/enums";
import Battle from "../../models/Battle";
import ArmyResource, { IArmyResource } from "./ArmyResource";
import AttackResource, { IAttackResource } from "./AttackResource";

export interface IBattle {
  name: string;
  uuid: string;
  status: BattleStatus;
  armies: IArmyResource[];
  attacks: IAttackResource[];
}

export default class BattleResource implements Resource<IBattle> {
  constructor(private readonly battle: Battle) {}
  public toJSON() {
    return {
      name: this.battle.name,
      uuid: this.battle.uuid,
      status: this.battle.status,
      armies: this.battle.armies
        ? this.battle.armies.map((army) => new ArmyResource(army).toJSON())
        : [],
      attacks: this.battle.attacks
        ? this.battle.attacks.map((attack) =>
            new AttackResource(attack).toJSON()
          )
        : [],
    };
  }
}
