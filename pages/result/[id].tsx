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
import Footer from "../../components/footer";
import useLocale from "@/hooks/useLocale";

const coords = coordsData as { id: string; x: number; y: number }[];
const PROMPT_TIMEOUT = 15;
const THANKS_TIMEOUT = 1;

export default function ResultPage() {
  const router = useRouter();
  const { id, fromMap: fromMapQuery } = router.query;
  const { locale, texts, changeLocale, SUPPORTED_LOCALES } = useLocale();

  const [debugHover, setDebugHover] = useState(false);
  const [mapDisplaySize, setMapDisplaySize] = useState(MAP_ORIGINAL_SIZE);
  const [iconScale, setIconScale] = useState(MAP_ORIGINAL_SIZE * ICON_SCALE_RATIO);

  const [showPrompt, setShowPrompt] = useState(true);
  const [progress, setProgress] = useState(100);
  const [thanksProgress, setThanksProgress] = useState(100);
  const [hasResponded, setHasResponded] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [thanksMessage, setThanksMessage] = useState<string | null>(null);

  const idStr = Array.isArray(id) ? id[0] : id ?? "";
  const seed = findSeed(idStr, seedDataRaw as Seed[]);

  useEffect(() => {
    const updateMapSize = () => {
      const headerHeight = 75;
      const footerHeight = 75;
      const availableHeight = window.innerHeight - headerHeight - footerHeight;
      const size = Math.min(Math.max(availableHeight, MAP_MIN_SIZE), MAP_MAX_SIZE);
      setMapDisplaySize(size);
      setIconScale(size * ICON_SCALE_RATIO);
    };
    updateMapSize();
    window.addEventListener("resize", updateMapSize);
    return () => window.removeEventListener("resize", updateMapSize);
  }, []);

  // Prompt automático
  useEffect(() => {
    if (!showPrompt || hasResponded) return;
    let timeLeft = PROMPT_TIMEOUT;
    setProgress(100);

    const interval = setInterval(() => {
      timeLeft -= 0.1;
      setProgress((timeLeft / PROMPT_TIMEOUT) * 100);
      if (timeLeft <= 0) {
        clearInterval(interval);
        setFadeOut(true);
        setTimeout(() => handleResponse(true), 500);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [showPrompt, hasResponded]);

  const sendLog = (bugReport: boolean) => {
    if (!seed) return;

    let sessionStart = sessionStorage.getItem("sessionStart");
    if (!sessionStart) {
      sessionStart = Date.now().toString();
      sessionStorage.setItem("sessionStart", sessionStart);
    }

    const sentSeeds: string[] = JSON.parse(sessionStorage.getItem("sentSeeds") || "[]");
    if (sentSeeds.includes(seed.seed_id)) return;

    sentSeeds.push(seed.seed_id);
    sessionStorage.setItem("sentSeeds", JSON.stringify(sentSeeds));

    const sessionDuration = Math.floor((Date.now() - parseInt(sessionStart, 10)) / 1000);

    fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seed_id: seed.seed_id,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        bug_report: bugReport,
        session_duration: sessionDuration,
        additional_info: { map_type: seed.map_type },
      }),
    }).finally(() => {
      sessionStorage.setItem("sessionStart", Date.now().toString());
    });

    if (fromMapQuery) {
      const { fromMap, ...rest } = router.query;
      router.replace({ pathname: router.pathname, query: rest }, undefined, { shallow: true });
    }
  };

  const handleResponse = (isYes: boolean) => {
    if (hasResponded || !texts.prompt) return; // ⚠️ Evita erro caso texts.prompt seja undefined
    setHasResponded(true);
    sendLog(!isYes);

    setThanksMessage(isYes ? texts.prompt.thanksYes : texts.prompt.thanksNo);

    let timeLeft = THANKS_TIMEOUT;
    setThanksProgress(100);
    const interval = setInterval(() => {
      timeLeft -= 0.1;
      setThanksProgress((timeLeft / THANKS_TIMEOUT) * 100);
      if (timeLeft <= 0) {
        clearInterval(interval);
        setFadeOut(true);
        setTimeout(() => setShowPrompt(false), 500);
      }
    }, 100);
  };

  const getIconSrcForSlot = (slotId: string, seedObj: Seed | null): string | undefined => {
    if (!seedObj) return undefined;
    if (slotId === "nightlord") return undefined;
    const v = seedObj.slots[slotId as SlotId];
    if (!v || v === "") return undefined;
    return buildingIcons[v] ?? buildingIcons["empty"];
  };

  const overlays = coords
    .map((c) => {
      const src = getIconSrcForSlot(c.id, seed);
      return src ? { id: c.id, x: c.x, y: c.y, src } : null;
    })
    .filter(Boolean) as { id: string; x: number; y: number; src: string }[];

  const eventOverlay = seed?.Event ? { id: "event", x: 910, y: 905, src: Events[seed.Event] } : null;

  if (!texts.header || !texts.prompt) return null;

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
            {texts.header.newMapButton}
          </button>

          <p className="absolute inset-x-0 text-center text-sm text-gray-200">
            {texts.header.seedLabel} <span className="font-semibold">{seed ? seed.seed_id : idStr}</span>. {texts.header.sourceLabel}:{" "}
            <a
              href="https://thefifthmatt.github.io/nightreign/"
              className="underline pointer-events-auto"
              target="_blank"
              rel="noreferrer"
            >
              {texts.header.sourceLink}
            </a>
          </p>

          <button
            aria-label={texts.header.debugButton}
            title={texts.header.debugButton}
            onMouseEnter={() => setDebugHover(true)}
            onMouseLeave={() => setDebugHover(false)}
            onFocus={() => setDebugHover(true)}
            onBlur={() => setDebugHover(false)}
            className="ml-auto w-9 h-9 rounded-full bg-gray-700 text-white flex items-center justify-center text-lg font-bold hover:bg-gray-600 z-10"
          >
            ?
          </button>

          <select
            value={locale}
            onChange={(e) => changeLocale(e.target.value)}
            className="ml-2 bg-gray-700 text-white px-2 py-1 rounded z-10"
          >
            {Object.entries(SUPPORTED_LOCALES).map(([code, name]) => (
              <option key={code} value={code}>
                {String(name)}
              </option>
            ))}
          </select>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6 w-full relative">
          <div className="relative" style={{ width: mapDisplaySize, height: mapDisplaySize }}>
            <img
              src={`https://thefifthmatt.github.io/nightreign/pattern/${idStr}.jpg`}
              alt={`Seed ${idStr}`}
              width={mapDisplaySize}
              height={mapDisplaySize}
              style={{ display: "block", width: "100%", height: "100%" }}
            />

            {debugHover &&
              overlays.map((ov) => {
                const topPos = (ov.y / MAP_ORIGINAL_SIZE) * mapDisplaySize;
                const leftPos = (ov.x / MAP_ORIGINAL_SIZE) * mapDisplaySize;
                return (
                  <div
                    key={ov.id}
                    className="overlay-icon overlay-icon-shadow"
                    style={{ top: topPos, left: leftPos, width: iconScale, height: iconScale }}
                  >
                    <Image src={ov.src} alt={ov.id} width={iconScale} height={iconScale} />
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
                <Image src={eventOverlay.src} alt="Event" width={iconScale * 2} height={iconScale * 2} />
              </div>
            )}
          </div>

          {showPrompt && (
            <div className={`feedback-box ${fadeOut ? "opacity-0" : "opacity-100"}`}>
              {thanksMessage ? (
                <div className="flex flex-1 items-center justify-center w-full">
                  <p className="text-center">{thanksMessage}</p>
                </div>
              ) : (
                <>
                  <p className="mb-3 text-center">{texts.prompt.question}</p>
                  <div className="flex gap-4 mb-2">
                    <button
                      onClick={() => handleResponse(true)}
                      className="px-4 py-1 bg-green-600 hover:bg-green-500 rounded"
                    >
                      {texts.prompt.yesButton}
                    </button>
                    <button
                      onClick={() => handleResponse(false)}
                      className="px-4 py-1 bg-red-600 hover:bg-red-500 rounded"
                    >
                      {texts.prompt.noButton}
                    </button>
                  </div>
                  <div className="h-1 w-full bg-gray-700 rounded">
                    <div
                      className="h-1 bg-white rounded transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </>
              )}

              {thanksMessage && (
                <div className="h-1 w-full bg-gray-700 rounded mt-2">
                  <div
                    className="h-1 bg-white rounded transition-all duration-100"
                    style={{ width: `${thanksProgress}%` }}
                  />
                </div>
              )}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
