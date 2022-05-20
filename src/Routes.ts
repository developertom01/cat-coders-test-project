import { celebrate, Segments } from "celebrate";
import express, { Router, RequestHandler } from "express";
import BattlesController from "./app/http/Controllers/BattlesController";
import BattleCreatePayload from "./app/http/Payloads/BattleCreatePayload";
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

export default router;
