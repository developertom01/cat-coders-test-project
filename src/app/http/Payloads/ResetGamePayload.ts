import { Joi } from "celebrate";

namespace ResetGamePayload {
  export interface paramsShape {
    battleUuid: string;
  }
  export const paramsSchema = Joi.object<paramsShape>().keys({
    battleUuid: Joi.string().uuid().required(),
  });
}
export default ResetGamePayload;
