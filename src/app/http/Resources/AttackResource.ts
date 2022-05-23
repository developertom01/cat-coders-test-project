import Resource from ".";
import { AttackStrategy } from "../../../utils/enums";
import Attack from "../../models/Attack";
import ArmyResource, { IArmyResource } from "./ArmyResource";

export interface IAttackResource {
  strategy: AttackStrategy;
  isSuccessfully: boolean;
  createdAt: string;
  receiver: IArmyResource | null;
  attacker: IArmyResource | null;
}

export default class AttackResource implements Resource<IAttackResource> {
  constructor(private readonly attack: Attack) {}
  public toJSON() {
    return {
      strategy: this.attack.strategy,
      isSuccessfully: this.attack.isSuccessfully,
      createdAt: this.attack.createdAt.toISOString(),
      receiver: this.attack.receiver
        ? new ArmyResource(this.attack.receiver).toJSON()
        : null,
      attacker: this.attack.attacker
        ? new ArmyResource(this.attack.attacker).toJSON()
        : null,
    };
  }
}
