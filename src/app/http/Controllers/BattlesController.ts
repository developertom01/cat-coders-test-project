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
import StartGamePayload from "../Payloads/StartGamePayload";
import BattleAddArmyPayload from "../Payloads/BattleAddArmyPayload";
import ArmyResource from "../Resources/ArmyResource";
import BattleGetAttacksPayload from "../Payloads/BattleGetAttacksPayload";
import AttackResource from "../Resources/AttackResource";
import ResetGamePayload from "../Payloads/ResetGamePayload";
import CeleryManager from "../../../managers/CeleryManager";
import Attack from "../../models/Attack";
export default class BattlesController {
  /**
   *
   * Return all active battles
   * @returns BattleResource[]
   */
  public static index = async (req: IRequest, res: IResponse) => {
    const battles = await Battle.findAll({
      include: [
        Battle.associations.attacks,
        {
          association: Battle.associations.armies,
        },
      ],
    });
    return res
      .status(200)
      .json(battles.map((battle) => new BattleResource(battle).toJSON()));
  };
  /**
   * Start a battle
   * Throws an error when active battle has already began
   * @returns BattleResource
   */
  public static store = async (
    req: IRequest<BattleCreatePayload.shape>,
    res: IResponse,
    next: NextFunction
  ) => {
    const { armies, name } = req.body;

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

    await battle.reload({
      include: [
        Battle.associations.attacks,
        {
          association: Battle.associations.armies,
          include: [Army.associations.attacked, Army.associations.received],
        },
      ],
    });

    return res.status(201).json(new BattleResource(battle).toJSON());
  };
  /**
   * Create new battle
   * Throws an error when active battle count is 5 or more
   * @returns BattleResource
   */
  public static startGame = async (
    req: IRequest<never, StartGamePayload.paramsShape>,
    res: IResponse
  ) => {
    const { battleUuid } = req.params;
    const battle = await Battle.findOne({
      where: { uuid: battleUuid },
      include: [Battle.associations.armies],
    });
    if (!battle) {
      throw new HTTPErrors.NotFoundError("Unknown battle");
    }
    if (battle.status === BattleStatus.ACTIVE) {
      throw new HTTPErrors.BadRequestError("Battle has already began.");
    }
    if (battle.armies!.length < 3) {
      throw new HTTPErrors.BadRequestError("Not enough army");
    }
    // const battleCount = await Battle.count({
    //   where: { status: BattleStatus.ACTIVE },
    // });
    // if (battleCount >= 5) {
    //   throw new HTTPErrors.BadRequestError(
    //     "Maximum active battle count exceeded"
    //   );
    // }
    await battle.update({ status: BattleStatus.ACTIVE });
    CeleryManager.client.createTask("task.battle").applyAsync([battle.id]);
    await battle.reload({
      include: [
        Battle.associations.attacks,
        {
          association: Battle.associations.armies,
          include: [Army.associations.attacked, Army.associations.received],
        },
      ],
    });
    return res.status(200).json(new BattleResource(battle));
  };
  /* Adding an army to the battle. */
  public static addAnArmy = async (
    req: IRequest<BattleAddArmyPayload.shape, BattleAddArmyPayload.paramsShape>,
    res: IResponse
  ) => {
    const { name, strategy, units } = req.body;
    const { battleUuid } = req.params;
    const battle = await Battle.findOne({ where: { uuid: battleUuid } });
    if (!battle) {
      throw new HTTPErrors.NotFoundError("Unknown battle");
    }
    if (battle.status === BattleStatus.ACTIVE) {
      throw new HTTPErrors.BadRequestError("Battle already in progress");
    }
    const army = await Army.create({
      battleId: battle.id,
      uuid: uuidv4(),
      name,
      attackStrategy: strategy,
      units,
      originalUnits: units,
    });
    return res.status(201).json(new ArmyResource(army).toJSON());
  };
  /* A function that is used to get the battle logs. */

  public static getBattleLogs = async (
    req: IRequest<never, BattleGetAttacksPayload.paramsShape>,
    res: IResponse
  ) => {
    const { battleUuid } = req.params;
    const battle = await Battle.findOne({
      where: { uuid: battleUuid },
      include: [
        {
          association: Battle.associations.attacks,
          include: [Attack.associations.receiver, Attack.associations.attacker],
        },
      ],
    });
    if (!battle) {
      throw new HTTPErrors.NotFoundError("Unknown battle");
    }
    return res
      .status(200)
      .json(
        battle.attacks!.map((attack) => new AttackResource(attack).toJSON())
      );
  };

  /* Resetting the battle. */
  public static resetBattle = async (
    req: IRequest<never, ResetGamePayload.paramsShape>,
    res: IResponse
  ) => {
    const { battleUuid } = req.params;
    const battle = await Battle.findOne({ where: { uuid: battleUuid } });
    if (!battle) {
      throw new HTTPErrors.NotFoundError("Unknown battle");
    }
    await battle.reset();
    await battle.reload();
    return res.status(200).json(new BattleResource(battle).toJSON());
  };
}
