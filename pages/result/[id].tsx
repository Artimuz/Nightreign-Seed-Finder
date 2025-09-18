import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import coordsData from "../../data/coordsXY.json";
import seedDataRaw from "../../data/seed_data.json";

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

const coords = coordsData as { id: string; x: number; y: number }[];

const buildingIcons = [
  { id: "empty", src: "/Images/buildingIcons/empty.webp" },
  { id: "church", src: "/Images/buildingIcons/church.webp" },
  { id: "fort", src: "/Images/buildingIcons/fort.webp" },
  { id: "fort_magic", src: "/Images/buildingIcons/fort_magic.webp" },
  { id: "greatchurch", src: "/Images/buildingIcons/greatchurch.webp" },
  { id: "greatchurch_fire", src: "/Images/buildingIcons/greatchurch_fire.webp" },
  { id: "greatchurch_holy", src: "/Images/buildingIcons/greatchurch_holy.webp" },
  { id: "mainencampment", src: "/Images/buildingIcons/mainencampment.webp" },
  { id: "mainencampment_eletric", src: "/Images/buildingIcons/mainencampment_eletric.webp" },
  { id: "mainencampment_fire", src: "/Images/buildingIcons/mainencampment_fire.webp" },
  { id: "mainencampment_madness", src: "/Images/buildingIcons/mainencampment_madness.webp" },
  { id: "ruins", src: "/Images/buildingIcons/ruins.webp" },
  { id: "ruins_bleed", src: "/Images/buildingIcons/ruins_bleed.webp" },
  { id: "ruins_blight", src: "/Images/buildingIcons/ruins_blight.webp" },
  { id: "ruins_eletric", src: "/Images/buildingIcons/ruins_eletric.webp" },
  { id: "ruins_fire", src: "/Images/buildingIcons/ruins_fire.webp" },
  { id: "ruins_frostbite", src: "/Images/buildingIcons/ruins_frostbite.webp" },
  { id: "ruins_holy", src: "/Images/buildingIcons/ruins_holy.webp" },
  { id: "ruins_magic", src: "/Images/buildingIcons/ruins_magic.webp" },
  { id: "ruins_poison", src: "/Images/buildingIcons/ruins_poison.webp" },
  { id: "ruins_sleep", src: "/Images/buildingIcons/ruins_sleep.webp" },
  { id: "sorcerers", src: "/Images/buildingIcons/sorcerers.webp" },
  { id: "township", src: "/Images/buildingIcons/township.webp" },
];

const nightlordIcons = [
  { id: "1_Gladius", src: "/Images/nightlordIcons/1_Gladius.webp" },
  { id: "2_Adel", src: "/Images/nightlordIcons/2_Adel.webp" },
  { id: "3_Gnoster", src: "/Images/nightlordIcons/3_Gnoster.webp" },
  { id: "4_Maris", src: "/Images/nightlordIcons/4_Maris.webp" },
  { id: "5_Libra", src: "/Images/nightlordIcons/5_Libra.webp" },
  { id: "6_Fulghor", src: "/Images/nightlordIcons/6_Fulghor.webp" },
  { id: "7_Caligo", src: "/Images/nightlordIcons/7_Caligo.webp" },
  { id: "8_Heolstor", src: "/Images/nightlordIcons/8_Heolstor.webp" },
];

export default function ResultPage() {
  const router = useRouter();
  const { id } = router.query;
  const [debugHover, setDebugHover] = useState(false);

  const mapOriginalSize = 1000;
  const mapDisplaySize = 1000;
  const overlayIconScale = 90;

  const idStr = Array.isArray(id) ? id[0] : id ?? "";

  const findSeed = (seedId: string): Seed | null => {
    const all = seedDataRaw as Seed[];
    if (!seedId) return null;
    let s = all.find((x) => x.seed_id === seedId);
    if (!s) {
      const padded = seedId.padStart(3, "0");
      s = all.find((x) => x.seed_id === padded);
    }
    return s ?? null;
  };

  const seed = findSeed(idStr);

  const getIconSrcForSlot = (slotId: string, seedObj: Seed | null): string | undefined => {
    if (!seedObj) return undefined;

    if (slotId === "nightlord") {
      const nl = seedObj.nightlord;
      if (!nl) return undefined;
      return nightlordIcons.find((i) => i.id === nl)?.src;
    } else {
      if ((slotId as SlotId) in seedObj.slots) {
        const v = seedObj.slots[slotId as SlotId];
        if (!v || v === "") return undefined;
        return buildingIcons.find((i) => i.id === v)?.src;
      }
      return undefined;
    }
  };

  const overlays = (() => {
    if (!seed) return [];
    const list: { id: string; x: number; y: number; src: string }[] = [];
    for (const c of coords) {
      const src = getIconSrcForSlot(c.id, seed);
      if (src) list.push({ id: c.id, x: c.x, y: c.y, src });
    }
    return list;
  })();

  return (
    <>
      <Head>
        <title>{seed ? `Seed ${seed.seed_id}` : `Seed ${idStr}`}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative flex flex-col items-center pb-8">
        <div className="flex justify-between w-full max-w-[1200px] p-4">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-gray-700 text-white rounded"
          >
            New Seed
          </button>

          <button
            aria-label="Debug overlay"
            title="Hover to show debug overlay"
            onMouseEnter={() => setDebugHover(true)}
            onMouseLeave={() => setDebugHover(false)}
            onFocus={() => setDebugHover(true)}
            onBlur={() => setDebugHover(false)}
            className="w-9 h-9 rounded-full bg-gray-700 text-white flex items-center justify-center text-lg font-bold hover:bg-gray-600"
          >
            ?
          </button>
        </div>

        <div className="relative" style={{ width: mapDisplaySize, height: mapDisplaySize }}>
          <img
            src={`https://thefifthmatt.github.io/nightreign/pattern/${idStr}.jpg`}
            alt={`Seed ${idStr}`}
            width={mapDisplaySize}
            height={mapDisplaySize}
            style={{ display: "block", width: mapDisplaySize, height: mapDisplaySize }}
          />

          {debugHover && seed && overlays.map((ov) => {
            const topPos = (ov.y / mapOriginalSize) * mapDisplaySize;
            const leftPos = (ov.x / mapOriginalSize) * mapDisplaySize;
            return (
              <div
                key={ov.id}
                style={{
                  position: "absolute",
                  top: `${topPos}px`,
                  left: `${leftPos}px`,
                  width: overlayIconScale,
                  height: overlayIconScale,
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                  zIndex: 60,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))",
                }}
              >
                <Image
                  src={ov.src || "/Images/buildingIcons/empty.webp"}
                  alt={ov.id}
                  width={overlayIconScale}
                  height={overlayIconScale}
                />
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-sm text-gray-200 max-w-[1000px] text-center">
          Seed found: <span className="font-semibold">{seed ? seed.seed_id : idStr}</span>. Source:{" "}
          <a href="https://thefifthmatt.github.io/nightreign/" className="underline" target="_blank" rel="noreferrer">
            thefifthmatt
          </a>
        </p>

        <style jsx>{`
          .text-gray-200 { color: #e5e7eb; }
        `}</style>
      </div>
    </>
  );
}
