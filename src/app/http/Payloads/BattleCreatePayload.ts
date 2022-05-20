import { Joi } from "celebrate";
import { AttackStrategy } from "../../../utils/enums";

namespace BattleCreatePayload {
  export interface armyShape {
    name: string;
    units: number;
    strategy: AttackStrategy;
  }
  export interface shape {
    name: string;
    armies: armyShape[];
  }
  export const schema = Joi.object<shape>().keys({
    name: Joi.string().min(3).required(),
    armies: Joi.array().items(
      Joi.object<armyShape>().keys({
        name: Joi.string().min(3).required(),
        units: Joi.number().min(80).max(100).required(),
        strategy: Joi.number()
          .valid(
            ...Object.values(AttackStrategy).filter((value) =>
              Number.isInteger(value)
            )
          )
          .required(),
      })
    ),
  });
}
export default BattleCreatePayload;
