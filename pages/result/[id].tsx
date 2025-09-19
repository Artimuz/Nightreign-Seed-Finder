import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";

import coordsData from "../../data/coordsXY.json";
import seedDataRaw from "../../data/seed_data.json";

import { Seed, SlotId } from "../../types";
import { buildingIcons, Events } from "../../constants/icons";
import { findSeed } from "../../utils/seedUtils";
import {
  MAP_ORIGINAL_SIZE,
  MAP_MIN_SIZE,
  MAP_MAX_SIZE,
  ICON_SCALE_RATIO,
} from "../../constants/layout";
import Footer from "@/components/footer";

const coords = coordsData as { id: string; x: number; y: number }[];

export default function ResultPage() {
  const router = useRouter();
  const { id } = router.query;
  const [debugHover, setDebugHover] = useState(false);
  const [mapDisplaySize, setMapDisplaySize] = useState(MAP_ORIGINAL_SIZE);
  const [iconScale, setIconScale] = useState(MAP_ORIGINAL_SIZE * ICON_SCALE_RATIO);

  const idStr = Array.isArray(id) ? id[0] : id ?? "";
  const seed = findSeed(idStr, seedDataRaw as Seed[]);

  useEffect(() => {
    const updateMapSize = () => {
      const headerHeight = 75;
      const footerPadding = 75;
      const availableHeight = window.innerHeight - headerHeight - footerPadding;
      const size = Math.min(Math.max(availableHeight, MAP_MIN_SIZE), MAP_MAX_SIZE);
      setMapDisplaySize(size);
      setIconScale(size * ICON_SCALE_RATIO);
    };
    updateMapSize();
    window.addEventListener("resize", updateMapSize);
    return () => window.removeEventListener("resize", updateMapSize);
  }, []);

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

      <div className="min-h-screen flex flex-col bg-black text-white">
      <header className="h-12 bg-gray-800 relative flex items-center px-6">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-1 bg-gray-700 text-white rounded z-10"
        >
          Change Map
        </button>
        <p className="absolute inset-x-0 text-center text-sm text-gray-200">
          Seed <span className="font-semibold">{seed ? seed.seed_id : idStr}</span>. Source:{" "}
          <a
            href="https://thefifthmatt.github.io/nightreign/"
            className="underline pointer-events-auto"
            target="_blank"
            rel="noreferrer"
          >
            thefifthmatt
          </a>
        </p>
        <button
          aria-label="Debug overlay"
          title="Hover to show debug overlay"
          onMouseEnter={() => setDebugHover(true)}
          onMouseLeave={() => setDebugHover(false)}
          onFocus={() => setDebugHover(true)}
          onBlur={() => setDebugHover(false)}
          className="ml-auto w-9 h-9 rounded-full bg-gray-700 text-white flex items-center justify-center text-lg font-bold hover:bg-gray-600 z-10"
        >
          ?
        </button>
      </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6 w-full">
          <div
            className="relative"
            style={{ width: mapDisplaySize, height: mapDisplaySize }}
          >
            <img
              src={`https://thefifthmatt.github.io/nightreign/pattern/${idStr}.jpg`}
              alt={`Seed ${idStr}`}
              width={mapDisplaySize}
              height={mapDisplaySize}
              style={{ display: "block", width: "100%", height: "100%" }}
            />

            {debugHover &&
              seed &&
              overlays.map((ov) => {
                const topPos = (ov.y / MAP_ORIGINAL_SIZE) * mapDisplaySize;
                const leftPos = (ov.x / MAP_ORIGINAL_SIZE) * mapDisplaySize;
                return (
                  <div
                    key={ov.id}
                    className="overlay-icon overlay-icon-shadow"
                    style={{
                      top: topPos,
                      left: leftPos,
                      width: iconScale,
                      height: iconScale,
                    }}
                  >
                    <Image
                      src={ov.src}
                      alt={ov.id}
                      width={iconScale}
                      height={iconScale}
                    />
                  </div>
                );
              })}

            {eventOverlay && (
              <div
                key={eventOverlay.id}
                className="overlay-icon event-icon-shadow"
                style={{
                  top: (eventOverlay.y / MAP_ORIGINAL_SIZE) * mapDisplaySize,
                  left: (eventOverlay.x / MAP_ORIGINAL_SIZE) * mapDisplaySize,
                  width: iconScale * 2,
                  height: iconScale * 2,
                }}
              >
                <Image
                  src={eventOverlay.src}
                  alt="Event"
                  width={iconScale * 2}
                  height={iconScale * 2}
                />
              </div>
            )}
          </div>

          {}
        </main>
        <Footer />
      </div>
    </>
  );
}
