import { IRequest, IResponse } from "../../../utils/interfaces";
import Battle from "../../models/Battle";
import BattleCreatePayload from "../Payloads/BattleCreatePayload";
import uuid from "uuid";
import DatabaseManager from "../../../managers/DatabaseManager";
import Army from "../../models/Army";
import BattleResource from "../Resources/Battle";
export default class BattlesController {
  public static index = async (
    req: IRequest<BattleCreatePayload.shape>,
    res: IResponse
  ) => {
    const { armies, name } = req.body;
    const battle = await DatabaseManager.instance.transaction(async (t) => {
      const battle = await Battle.create(
        {
          name,
          uuid: uuid.v4(),
        },
        { transaction: t }
      );
      await Army.bulkCreate(
        armies.map((army) => ({
          battleId: battle.id,
          name: army.name,
          units: army.units,
          uuid: uuid.v4(),
          attackStrategy: army.strategy,
          originalUnits: army.units,
        })),
        { transaction: t }
      );
      return battle;
    });
    await battle.reload({ include: [Battle.associations.armies] });
    return res.json(new BattleResource(battle).toJSON());
  };
}
