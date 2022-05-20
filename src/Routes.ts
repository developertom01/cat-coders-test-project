import { celebrate, Segments } from "celebrate";
import express from "express";
import BattlesController from "./app/http/Controllers/BattlesController";
import BattleCreatePayload from "./app/http/Payloads/BattleCreatePayload";

const router = express.Router();
router
  .route("/battles")
  .get(BattlesController.index)
  .post(
    celebrate({ [Segments.BODY]: BattleCreatePayload.schema }),
    BattlesController.store
  );

export default router;
