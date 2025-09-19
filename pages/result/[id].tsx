import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

import coordsData from "../../data/coordsXY.json";
import seedDataRaw from "../../data/seed_data.json";

import { Seed, SlotId } from "../../types";
import { buildingIcons, Events } from "../../constants/icons";
import { findSeed } from "../../utils/seedUtils";

const coords = coordsData as { id: string; x: number; y: number }[];

export default function ResultPage() {
  const router = useRouter();
  const { id } = router.query;
  const [debugHover, setDebugHover] = useState(false);

  const mapOriginalSize = 1000;
  const mapDisplaySize = 1100;
  const overlayIconScale = 90;
  const eventIconScale = 180;

  const idStr = Array.isArray(id) ? id[0] : id ?? "";
  const seed = findSeed(idStr, seedDataRaw as Seed[]);

  const getIconSrcForSlot = (slotId: string, seedObj: Seed | null): string | undefined => {
    if (!seedObj) return undefined;
    if (slotId === "nightlord") return undefined;

    const v = seedObj.slots[slotId as SlotId];
    if (!v || v === "") return undefined;

    return buildingIcons[v] ?? buildingIcons["empty"];
  };

  const overlays = (() => {
    if (!seed) return [];
    return coords
      .map((c) => {
        const src = getIconSrcForSlot(c.id, seed);
        return src ? { id: c.id, x: c.x, y: c.y, src } : null;
      })
      .filter(Boolean) as { id: string; x: number; y: number; src: string }[];
  })();

  const eventOverlay = (() => {
    if (!seed?.Event) return null;
    const eventIconSrc = Events[seed.Event];
    if (!eventIconSrc) return null;
    return { id: "event", x: 910, y: 905, src: eventIconSrc };
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

          {debugHover &&
            seed &&
            overlays.map((ov) => {
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
                    src={ov.src}
                    alt={ov.id}
                    width={overlayIconScale}
                    height={overlayIconScale}
                  />
                </div>
              );
            })}

          {eventOverlay && (
            <div
              key={eventOverlay.id}
              style={{
                position: "absolute",
                top: `${(eventOverlay.y / mapOriginalSize) * mapDisplaySize}px`,
                left: `${(eventOverlay.x / mapOriginalSize) * mapDisplaySize}px`,
                width: eventIconScale,
                height: eventIconScale,
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                zIndex: 70,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.7))",
              }}
            >
              <Image
                src={eventOverlay.src}
                alt="Event"
                width={eventIconScale}
                height={eventIconScale}
              />
            </div>
          )}
        </div>

        <p className="mt-4 text-sm text-gray-200 max-w-[1000px] text-center">
          Seed found: <span className="font-semibold">{seed ? seed.seed_id : idStr}</span>. Source:{" "}
          <a
            href="https://thefifthmatt.github.io/nightreign/"
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            thefifthmatt
          </a>
        </p>

        <style jsx>{`
          .text-gray-200 {
            color: #e5e7eb;
          }
        `}</style>
      </div>
    </>
  );
}
