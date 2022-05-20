import Battle from "../app/models/Battle";
import { v4 as uuidv4 } from "uuid";
import Army from "../app/models/Army";
import { HTTPErrors } from "../utils/Errors";

describe("Test Army methods", () => {
  afterEach(async () => {
    await Promise.all([
      Battle.destroy({ where: {} }),
      Army.destroy({ where: {} }),
    ]);
  });
  it("Should create an army", async () => {
    const battle = await Battle.create({
      name: "Battle one",
      uuid: uuidv4(),
    });
    expect(battle).not.toBeNull();
    const army = await Army.create({
      battleId: battle.id,
      name: "Some army",
      uuid: uuidv4(),
      units: 89,
      originalUnits: 89,
    });
    expect(army).not.toBeNull();
  });
  it("Should damage by 0.5", async () => {
    const battle = await Battle.create({
      name: "Battle one",
      uuid: uuidv4(),
    });
    const army = await Army.create({
      battleId: battle.id,
      name: "Some army",
      uuid: uuidv4(),
      units: 89,
      originalUnits: 89,
    });
    await army.damage();
    await army.reload();
    expect(army.units).toBe(88.5);
  });
  it("Should deduct by 1 when unit left is 1", async () => {
    const battle = await Battle.create({
      name: "Battle one",
      uuid: uuidv4(),
    });
    const army = await Army.create({
      battleId: battle.id,
      name: "Some army",
      uuid: uuidv4(),
      units: 1,
      originalUnits: 1,
    });
    await army.damage();
    await army.reload();
    expect(army.units).toBe(0);
  });
  it("reset should reset army to original state", async () => {
    const battle = await Battle.create({
      name: "Battle one",
      uuid: uuidv4(),
    });
    const army = await Army.create({
      battleId: battle.id,
      name: "Some army",
      uuid: uuidv4(),
      units: 10,
      originalUnits: 10,
    });
    await army.damage();
    await army.damage();
    await army.damage();
    await army.damage();
    await army.reset();
    await army.reload();
    expect(army.units).toBe(10);
  });
});
