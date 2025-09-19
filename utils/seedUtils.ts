import { Seed } from "../types";

export const findSeed = (seedId: string, seeds: Seed[]): Seed | null => {
  if (!seedId) return null;
  let s = seeds.find((x) => x.seed_id === seedId);
  if (!s) {
    const padded = seedId.padStart(3, "0");
    s = seeds.find((x) => x.seed_id === padded);
  }
  return s ?? null;
};
