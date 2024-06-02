import { Pill } from "src/pills/pill.entity";
import { EntityManager } from "typeorm";
import { parse } from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';
import { Med } from "src/meds/med.entity";

export const seedData = async (manager: EntityManager): Promise<void> => {
  const baseDir = path.resolve(__dirname, '..', '..', '..', 'data');

  await Promise.all([seedPill(), seedMed()]);

  async function seedPill() {
    const pills: Pill[] = [];
    const filePath = path.resolve(baseDir, 'pills.csv');

    const parser = fs.createReadStream(filePath).pipe(parse({ delimiter: ',', from_line: 1 }));

    for await (const row of parser) {
      const pill = new Pill();
      pill.id = parseInt(row[0], 10);
      pill.medName = row[1];
      pill.drugShape = row[2];
      pill.colorClass1 = row[3];
      pill.colorClass2 = row[4];
      pill.lineFront = row[5];
      pill.lineBack = row[6];
      pill.lengLong = row[7];
      pill.lengShort = row[8];
      pill.thick = row[9];
      pill.formCodeName = row[10];
      pills.push(pill);

      // Batch insertion every 1000 records or when reaching the end of the file
      if (pills.length >= 300 || row === null) {
        try {
          await manager.save(Pill, pills);
        } catch (error) {
          console.error('Error saving pills:', error);
          throw error;
        }
        // Clear the pills array for the next batch
        pills.length = 0;
      }
    }
    // Insert the remaining records (last batch) if any
    if (pills.length > 0) {
      try {
        await manager.save(Pill, pills);
      } catch (error) {
        console.error('Error saving pills:', error);
        throw error;
      }
    }
  }

  async function seedMed() {
    const meds: Med[] = [];
    const filePath = path.resolve(baseDir, 'meds.csv');
  
    const parser = fs.createReadStream(filePath).pipe(parse({ delimiter: ',', from_line: 1 }));
  
    for await (const row of parser) {
      const med = new Med();
      med.id = parseInt(row[0], 10);
      med.companyName = row[1];
      med.medName = row[2];
      med.effect = row[3];
      med.howToUse = row[4];
      med.criticalInfo = row[5];
      med.warning = row[6];
      med.interaction = row[7];
      med.sideEffect = row[8];
      med.howToStore = row[9];
      meds.push(med);
  
      // Batch insertion every 300 records or when reaching the end of the file
      if (meds.length >= 300 || row === null) {
        try {
          await manager.save(Med, meds);
        } catch (error) {
          console.error('Error saving meds:', error);
          throw error;
        }
        // Clear the meds array for the next batch
        meds.length = 0;
      }
    }
  
    // Insert the remaining records (last batch) if any
    if (meds.length > 0) {
      try {
        await manager.save(Med, meds);
      } catch (error) {
        console.error('Error saving meds:', error);
        throw error;
      }
    }
  }
};