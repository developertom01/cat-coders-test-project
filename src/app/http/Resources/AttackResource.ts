import Resource from ".";
import { AttackStrategy } from "../../../utils/enums";
import Attack from "../../models/Attack";

export interface IAttackResource {
  strategy: AttackStrategy;
  isSuccessfully: boolean;
  createdAt: string;
}

export default class AttackResource implements Resource<IAttackResource> {
  constructor(private readonly attack: Attack) {}
  public toJSON() {
    return {
      strategy: this.attack.strategy,
      isSuccessfully: this.attack.isSuccessfully,
      createdAt: this.attack.createdAt.toISOString(),
    };
  }
}
