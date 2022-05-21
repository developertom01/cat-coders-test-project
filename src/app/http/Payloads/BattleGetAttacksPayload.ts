import { Joi } from "celebrate";

namespace BattleGetAttacksPayload {
  export interface paramsShape {
    battleUuid: string;
  }
  export const paramsSchema = Joi.object<paramsShape>().keys({
    battleUuid: Joi.string().uuid().required(),
  });
}
export default BattleGetAttacksPayload;
