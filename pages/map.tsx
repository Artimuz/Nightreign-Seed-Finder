import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import coordsData from "../data/coordsXY.json";
import seedDataRaw from "../data/seed_data.json";


type SlotId =
  | "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10"
  | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18" | "19" | "20"
  | "21" | "22" | "23" | "24" | "25" | "26" | "27";

interface Seed {
  seed_id: string;
  map_type: string;
  nightlord: string;
  slots: Record<SlotId, string>;
}

const coords = coordsData;

const buildingIcons = [
  { id: "empty", src: "/Images/buildingIcons/empty.png" },
  { id: "church", src: "/Images/buildingIcons/church.png" },
  { id: "fort", src: "/Images/buildingIcons/fort.png" },
  { id: "fort_magic", src: "/Images/buildingIcons/fort_magic.png" },
  { id: "greatchurch", src: "/Images/buildingIcons/greatchurch.png" },
  { id: "greatchurch_fire", src: "/Images/buildingIcons/greatchurch_fire.png" },
  { id: "greatchurch_holy", src: "/Images/buildingIcons/greatchurch_holy.png" },
  { id: "mainencampment", src: "/Images/buildingIcons/mainencampment.png" },
  { id: "mainencampment_eletric", src: "/Images/buildingIcons/mainencampment_eletric.png" },
  { id: "mainencampment_fire", src: "/Images/buildingIcons/mainencampment_fire.png" },
  { id: "mainencampment_madness", src: "/Images/buildingIcons/mainencampment_madness.png" },
  { id: "ruins", src: "/Images/buildingIcons/ruins.png" },
  { id: "ruins_bleed", src: "/Images/buildingIcons/ruins_bleed.png" },
  { id: "ruins_blight", src: "/Images/buildingIcons/ruins_blight.png" },
  { id: "ruins_eletric", src: "/Images/buildingIcons/ruins_eletric.png" },
  { id: "ruins_fire", src: "/Images/buildingIcons/ruins_fire.png" },
  { id: "ruins_frostbite", src: "/Images/buildingIcons/ruins_frostbite.png" },
  { id: "ruins_holy", src: "/Images/buildingIcons/ruins_holy.png" },
  { id: "ruins_magic", src: "/Images/buildingIcons/ruins_magic.png" },
  { id: "ruins_poison", src: "/Images/buildingIcons/ruins_poison.png" },
  { id: "ruins_sleep", src: "/Images/buildingIcons/ruins_sleep.png" },
  { id: "sorcerers", src: "/Images/buildingIcons/sorcerers.png" },
  { id: "township", src: "/Images/buildingIcons/township.png" },
];

const nightlordIcons = [
  { id: "1_Gladius", src: "/Images/nightlordIcons/1_Gladius.png" },
  { id: "2_Adel", src: "/Images/nightlordIcons/2_Adel.png" },
  { id: "3_Gnoster", src: "/Images/nightlordIcons/3_Gnoster.png" },
  { id: "4_Maris", src: "/Images/nightlordIcons/4_Maris.png" },
  { id: "5_Libra", src: "/Images/nightlordIcons/5_Libra.png" },
  { id: "6_Fulghor", src: "/Images/nightlordIcons/6_Fulghor.png" },
  { id: "7_Caligo", src: "/Images/nightlordIcons/7_Caligo.png" },
  { id: "8_Heolstor", src: "/Images/nightlordIcons/8_Heolstor.png" },
  { id: "empty", src: "/Images/buildingIcons/empty.png" },
];

export default function MapPage() {
  const router = useRouter();
  const { type } = router.query as { type?: string };

  const mapOriginalSize = 1000;
  const mapDisplaySize = 1000;
  const iconScale = 85;

  const [slots, setSlots] = useState<Record<string, string>>({ nightlord: "empty" });
  const [remainingSeeds, setRemainingSeeds] = useState<Seed[]>([]);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  const maxColumns = 4;

  useEffect(() => {
    if (type) {
      setRemainingSeeds(seedDataRaw.filter((seed: Seed) => seed.map_type === type));
    }
  }, [type]);

  const handleSlotSelection = (slotId: string, iconId: string) => {
    setSlots((prev) => {
      const newSlots = { ...prev };
      if (iconId === "empty") delete newSlots[slotId];
      else newSlots[slotId] = iconId;
      return newSlots;
    });

    const filtered = seedDataRaw.filter((seed: Seed) => {
      if (type && seed.map_type !== type) return false;
      for (const [sId, val] of Object.entries({ ...slots, [slotId]: iconId })) {
        if (val === "empty") continue;
        if (sId === "nightlord" && seed.nightlord !== val) return false;
        if (sId !== "nightlord" && seed.slots[sId as SlotId] !== val) return false;
      }
      return true;
    });

    setRemainingSeeds(filtered);

    if (filtered.length === 1) {
      router.push(`/result/${filtered[0].seed_id}`);
    }

    setActiveSlot(null);
  };

  const getValidIconsForSlot = (slotId: string) => {
    const validIds = new Set<string>();
    remainingSeeds.forEach((seed) => {
      if (slotId === "nightlord") validIds.add(seed.nightlord);
      else if (seed.slots[slotId as SlotId]) validIds.add(seed.slots[slotId as SlotId]);
    });
    validIds.add("empty");

    return slotId === "nightlord"
      ? nightlordIcons.filter((icon) => validIds.has(icon.id))
      : buildingIcons.filter((icon) => validIds.has(icon.id));
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
            src={`/Images/mapTypes/${type}.png`}
            alt={type}
            width={mapDisplaySize}
            height={mapDisplaySize}
            priority
          />
        )}

        {coords.map((slot) => {
          const validIcons = getValidIconsForSlot(slot.id);
          const iconId = slots[slot.id] || "empty";
          const topPos = (slot.y / mapOriginalSize) * mapDisplaySize - iconScale / 2;
          const leftPos = (slot.x / mapOriginalSize) * mapDisplaySize - iconScale / 2;

          if (/^(0?[1-9]|1[0-9]|2[0-7])$/.test(slot.id) && validIcons.length === 1 && validIcons[0].id === "empty") {
            return null;
          }

          const iconSrc =
            slot.id === "nightlord"
              ? nightlordIcons.find((b) => b.id === iconId)?.src
              : buildingIcons.find((b) => b.id === iconId)?.src;

          return (
            <div
              key={slot.id}
              style={{
                position: "absolute",
                top: topPos,
                left: leftPos,
                width: iconScale,
                height: iconScale,
                cursor: validIcons.length > 1 ? "pointer" : "default",
              }}
              onClick={() => (validIcons.length > 1 ? setActiveSlot(slot.id) : null)}
            >
              <Image
                src={iconSrc || "/Images/buildingIcons/empty.png"}
                alt={iconId}
                width={iconScale}
                height={iconScale}
              />
            </div>
          );
        })}

        {}
        {activeSlot && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50 transition-opacity duration-150"
            onClick={() => setActiveSlot(null)}
          >
            <div
              className="bg-gray-800 border border-gray-400 rounded-lg p-6 max-w-[500px] w-full transform transition-all duration-150 scale-85 opacity-0 animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: `repeat(${maxColumns}, minmax(0, 1fr))`,
                }}
              >
                {getValidIconsForSlot(activeSlot).map((icon) => (
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
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setActiveSlot(null)}
                  className="px-4 py-2 bg-black rounded hover:bg-gray-600"
                >
                  Close
                </button>
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
