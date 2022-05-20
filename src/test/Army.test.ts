import Battle from "../app/models/Battle";
import { v4 as uuidv4 } from "uuid";
import Army from "../app/models/Army";

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
});
