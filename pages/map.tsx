import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";

import coordsData from "../data/coordsXY.json";
import seedDataRaw from "../data/seed_data.json";

import { Seed, SlotId } from "../types";
import { buildingIcons, nightlordIcons, buildingIconOrder } from "../constants/icons";

const coords = coordsData as { id: string; x: number; y: number }[];

export default function MapPage() {
  const router = useRouter();
  const { type } = router.query as { type?: string };

  const mapOriginalSize = 1000;
  const mapDisplaySize = 1100;
  const iconScale = 80;

  const [slots, setSlots] = useState<Record<string, string>>({ nightlord: "empty" });
  const [remainingSeeds, setRemainingSeeds] = useState<Seed[]>([]);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  const maxColumns = 4;

  useEffect(() => {
    const allSeeds = seedDataRaw as Seed[];
    if (type) setRemainingSeeds(allSeeds.filter(s => s.map_type === type));
    else setRemainingSeeds(allSeeds);
  }, [type]);

  const computeOptionsForSlot = (slotId: string, excludeCurrent = false) => {
    const allSeeds = seedDataRaw as Seed[];
    const validIds = new Set<string>();

    for (const seed of allSeeds) {
      if (type && seed.map_type !== type) continue;

      let ok = true;
      for (const [sId, val] of Object.entries(slots)) {
        if (sId === slotId) continue;
        if (!val || val === "empty") continue;

        if (sId === "nightlord") {
          if (seed.nightlord !== val) { ok = false; break; }
        } else {
          if (seed.slots?.[sId as SlotId] !== val) { ok = false; break; }
        }
      }
      if (!ok) continue;

      if (slotId === "nightlord") {
        validIds.add(seed.nightlord || "empty");
      } else {
        const v = seed.slots?.[slotId as SlotId] ?? "";
        validIds.add(v && v !== "" ? v : "empty");
      }
    }

    validIds.add("empty");

    const current = slots[slotId] || "empty";
    if (excludeCurrent) validIds.delete(current);

    const iconsPool = slotId === "nightlord" ? nightlordIcons : buildingIcons;

    return Array.from(validIds).map((id) => ({
      id,
      src: iconsPool[id] ?? buildingIcons["empty"],
    }));
  };

  const handleSlotSelection = (slotId: string, iconId: string) => {
    const nextSlots = { ...slots };
    if (iconId === "empty") delete nextSlots[slotId];
    else nextSlots[slotId] = iconId;

    const allSeeds = seedDataRaw as Seed[];
    const filtered = allSeeds.filter((seed) => {
      if (type && seed.map_type !== type) return false;
      for (const [sId, val] of Object.entries(nextSlots)) {
        if (val === "empty") continue;
        if (sId === "nightlord") {
          if (seed.nightlord !== val) return false;
        } else {
          if (seed.slots?.[sId as SlotId] !== val) return false;
        }
      }
      return true;
    });

    setSlots(nextSlots);
    setRemainingSeeds(filtered);

    if (filtered.length === 1) {
      router.push(`/result/${filtered[0].seed_id}`);
    }

    setActiveSlot(null);
  };

  return (
    <>
      <Head>
        <title>Nightreign Seed Finder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative flex flex-col items-center">
        <div className="flex justify-between w-full max-w-[1200px] p-4">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-gray-700 text-white rounded"
          >
            Change Map
          </button>
          <p className="text-gray-600">Map: {type}</p>
          <p className="text-gray-600">Seeds Remaining: {remainingSeeds.length}</p>
        </div>

        <div className="relative" style={{ width: mapDisplaySize, height: mapDisplaySize }}>
          {type && (
            <Image
              src={`/Images/mapTypes/${type}.webp`}
              alt={type}
              width={mapDisplaySize}
              height={mapDisplaySize}
              priority
            />
          )}

          {coords.map((slot) => {
            const currentId = slots[slot.id] || "empty";
            const fullOptions = computeOptionsForSlot(slot.id, false);
            const modalOptions = computeOptionsForSlot(slot.id, true);

            if (/^(0?[1-9]|1[0-9]|2[0-7])$/.test(slot.id)) {
              if (fullOptions.length === 1 && fullOptions[0].id === "empty") {
                return null;
              }
            }

            const topPos = (slot.y / mapOriginalSize) * mapDisplaySize - iconScale / 2;
            const leftPos = (slot.x / mapOriginalSize) * mapDisplaySize - iconScale / 2;

            const iconSrc =
              slot.id === "nightlord"
                ? nightlordIcons[currentId] ?? buildingIcons["empty"]
                : buildingIcons[currentId] ?? buildingIcons["empty"];

            return (
              <div
                key={slot.id}
                style={{
                  position: "absolute",
                  top: topPos,
                  left: leftPos,
                  width: iconScale,
                  height: iconScale,
                  cursor: modalOptions.length > 0 ? "pointer" : "default",
                }}
                onClick={() => (modalOptions.length > 0 ? setActiveSlot(slot.id) : null)}
              >
                <Image
                  src={iconSrc}
                  alt={currentId}
                  width={iconScale}
                  height={iconScale}
                />
              </div>
            );
          })}

          {activeSlot && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50 transition-opacity duration-150"
              onClick={() => setActiveSlot(null)}
            >
              <div
                className="items-center justify-center bg-gray-800 border border-gray-400 rounded-lg p-5 w-auto max-w-[450px] transform transition-all duration-150 scale-95 opacity-0 animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="items-center justify-center grid gap-4 auto-cols-auto auto-rows-auto"
                  style={{
                    gridTemplateColumns: `repeat(${maxColumns}, minmax(0, auto))`,
                  }}
                >
                  {computeOptionsForSlot(activeSlot, true)
                    .sort((a, b) => buildingIconOrder.indexOf(a.id) - buildingIconOrder.indexOf(b.id))
                    .map((icon) => (
                      <div
                        key={icon.id}
                        className="flex items-center justify-center cursor-pointer hover:opacity-80"
                        onClick={() => handleSlotSelection(activeSlot, icon.id)}
                      >
                        <Image
                          src={icon.src}
                          alt={icon.id}
                          width={iconScale}
                          height={iconScale}
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <style jsx global>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.15s ease-out forwards;
          }
        `}</style>
      </div>
    </>
  );
}