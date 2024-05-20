import { Pill } from "src/pills/pill.entity"
import { EntityManager } from "typeorm";

export const seedData = async (manager: EntityManager): Promise<void> => { //1
  // Add your seeding logic here using the manager
  // For example:
  // await seedArtist();
  // await seedPlayLists();
  await seedPill();

async function seedPill() {
    // const pill = new Pill();
    // await manager.getRepository(Pill).save(pill);
  }
};