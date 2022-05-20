import { IRequest, IResponse } from "../../../utils/interfaces";
import Battle from "../../models/Battle";
import BattleCreatePayload from "../Payloads/BattleCreatePayload";
import { v4 as uuidv4 } from "uuid";
import DatabaseManager from "../../../managers/DatabaseManager";
import Army from "../../models/Army";
import BattleResource from "../Resources/Battle";
import { BattleStatus } from "../../../utils/enums";
import { HTTPErrors } from "../../../utils/Errors";
import { NextFunction } from "express";
export default class BattlesController {
  /**
   *
   * Return all active battles
   * @returns BattleResource[]
   */
  public static index = async (req: IRequest, res: IResponse) => {
    const battles = await Battle.findAll({
      where: { status: BattleStatus.ACTIVE },
      include: [Battle.associations.armies],
    });
    return res
      .status(200)
      .json(battles.map((battle) => new BattleResource(battle).toJSON()));
  };
  /**
   * Create new battle
   * Throws an error when active battle count is 5 or more
   * @returns BattleResource
   */
  public static store = async (
    req: IRequest<BattleCreatePayload.shape>,
    res: IResponse,
    next: NextFunction
  ) => {
    const { armies, name } = req.body;
    const battleCount = await Battle.count({
      where: { status: BattleStatus.ACTIVE },
    });
    if (battleCount >= 5) {
      throw new HTTPErrors.BadRequestError(
        "Maximum active battle count exceeded"
      );
    }
    const battle = await DatabaseManager.instance.transaction(async (t) => {
      const battle = await Battle.create(
        {
          name,
          uuid: uuidv4(),
        },
        { transaction: t }
      );
      await Army.bulkCreate(
        armies?.map((army) => ({
          battleId: battle.id,
          name: army.name,
          units: army.units,
          uuid: uuidv4(),
          attackStrategy: army.strategy,
          originalUnits: army.units,
        })) ?? [],
        { transaction: t }
      );
      return battle;
    });

    await battle.reload({ include: [Battle.associations.armies] });

    return res.status(201).json(new BattleResource(battle).toJSON());
  };
}
