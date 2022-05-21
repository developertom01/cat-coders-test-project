import { Joi } from "celebrate";
import { AttackStrategy } from "../../../utils/enums";

namespace BattleAddArmyPayload {
  export interface paramsShape {
    battleUuid: string;
  }
  export interface shape {
    name: string;
    units: number;
    strategy: AttackStrategy;
  }
  export const schema = Joi.object<shape>().keys({
    name: Joi.string().min(3).required(),
    units: Joi.number().min(80).max(100).required(),
    strategy: Joi.number()
      .valid(
        ...Object.values(AttackStrategy).filter((value) =>
          Number.isInteger(value)
        )
      )
      .required(),
  });
  export const paramsSchema = Joi.object<paramsShape>().keys({
    battleUuid: Joi.string().uuid().required(),
  });
}
export default BattleAddArmyPayload;
