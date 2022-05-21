import { celebrate, Segments } from "celebrate";
import express from "express";
import BattlesController from "./app/http/Controllers/BattlesController";
import BattleAddArmyPayload from "./app/http/Payloads/BattleAddArmyPayload";
import BattleCreatePayload from "./app/http/Payloads/BattleCreatePayload";
import BattleGetAttacksPayload from "./app/http/Payloads/BattleGetAttacksPayload";
import StartGamePayload from "./app/http/Payloads/StartGamePayload";
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};
const router = express.Router();
router
  .route("/battles")
  .get(asyncHandler(BattlesController.index))
  .post(
    celebrate({ [Segments.BODY]: BattleCreatePayload.schema }),
    asyncHandler(BattlesController.store)
  );
router.post(
  "/battles/:battleUuid/add-army",
  celebrate({
    [Segments.PARAMS]: BattleAddArmyPayload.paramsSchema,
    [Segments.BODY]: BattleAddArmyPayload.schema,
  }),
  asyncHandler(BattlesController.addAnArmy)
);
router.patch(
  "/battles/:battleUuid/start-battle",
  celebrate({ [Segments.PARAMS]: StartGamePayload.paramsSchema }),
  asyncHandler(BattlesController.startGame)
);
router.get(
  "/battles/:battleUuid/logs",
  celebrate({ [Segments.PARAMS]: BattleGetAttacksPayload.paramsSchema }),
  asyncHandler(BattlesController.getBattleLogs)
);

export default router;
