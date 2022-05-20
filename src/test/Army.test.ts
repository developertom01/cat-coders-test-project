import Battle from "../app/models/Battle";
import { v4 as uuidv4 } from "uuid";
import Army from "../app/models/Army";

describe("Test Army methods", () => {
  beforeEach(async () => {
    await Battle.destroy({ where: {} });
    await Army.destroy({ where: {} });
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
  it("Should damage army with lowest unit", async () => {
    const battle = await Battle.create({
      name: "Battle one",
      uuid: uuidv4(),
    });
    const [army1, army2, army3] = await Promise.all([
      Army.create({
        battleId: battle.id,
        name: "Some army",
        uuid: uuidv4(),
        units: 100,
        originalUnits: 100,
      }),
      Army.create({
        battleId: battle.id,
        name: "Some army",
        uuid: uuidv4(),
        units: 95,
        originalUnits: 95,
      }),
      await Army.create({
        battleId: battle.id,
        name: "Some army",
        uuid: uuidv4(),
        units: 88,
        originalUnits: 88,
      }),
    ]);
    await army1.weekAttack();
    await Promise.all([army1.reload(), army2.reload(), army3.reload()]);
    expect(army3.units).toBe(87.5);
    expect(army2.units).toBe(95);
    expect(army1.units).toBe(100);
  });
});
