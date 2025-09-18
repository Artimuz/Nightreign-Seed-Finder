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
  { id: "empty", src: "/Images/buildingIcons/empty.webp" },
];

export default function MapPage() {
  const router = useRouter();
  const { type } = router.query as { type?: string };

  const mapOriginalSize = 1000;
  const mapDisplaySize = 1000;
  const iconScale = 85;

  // slots mantém apenas os valores que o usuário confirmou (se vazio -> não existe a chave)
  const [slots, setSlots] = useState<Record<string, string>>({ nightlord: "empty" });
  const [remainingSeeds, setRemainingSeeds] = useState<Seed[]>([]);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  const maxColumns = 4;

  // inicializa remainingSeeds com filtro por tipo de mapa (se houver)
  useEffect(() => {
    const allSeeds = seedDataRaw as Seed[];
    if (type) setRemainingSeeds(allSeeds.filter(s => s.map_type === type));
    else setRemainingSeeds(allSeeds);
  }, [type]);

  // calcula as opções possíveis para um slot - se excludeCurrent === true, remove o valor atual do slot
  const computeOptionsForSlot = (slotId: string, excludeCurrent = false) => {
    const allSeeds = seedDataRaw as Seed[];
    const validIds = new Set<string>();

    // Para cada seed, verificamos se ela é compatível com as outras escolhas do usuário (exceto o slot sendo editado)
    for (const seed of allSeeds) {
      if (type && seed.map_type !== type) continue;

      let ok = true;
      for (const [sId, val] of Object.entries(slots)) {
        if (sId === slotId) continue; // ignorar o slot que estamos avaliando (simular vazio)
        if (!val) continue;
        if (val === "empty") continue;
        if (sId === "nightlord") {
          if (seed.nightlord !== val) { ok = false; break; }
        } else {
          // validação para slots "01".."27"
          if (seed.slots?.[sId as SlotId] !== val) { ok = false; break; }
        }
      }
      if (!ok) continue;

      // se a seed passou nas restrições acima, coleta o valor possível para slotId nessa seed
      if (slotId === "nightlord") {
        validIds.add(seed.nightlord || "empty");
      } else {
        const v = seed.slots?.[slotId as SlotId] ?? "";
        validIds.add(v && v !== "" ? v : "empty");
      }
    }

    // garantir que o usuário sempre possa escolher 'empty' (limpar)
    validIds.add("empty");

    const current = slots[slotId] || "empty";
    if (excludeCurrent) validIds.delete(current);

    // transforma em objetos de ícone
    const iconsPool = slotId === "nightlord" ? nightlordIcons : buildingIcons;
    const icons = iconsPool.filter((ic) => validIds.has(ic.id));

    return icons;
  };

  // quando o usuário confirma uma opção no modal
  const handleSlotSelection = (slotId: string, iconId: string) => {
    // calcula nextSlots (estado *final* após a seleção)
    const nextSlots = { ...slots };
    if (iconId === "empty") delete nextSlots[slotId];
    else nextSlots[slotId] = iconId;

    // filtra seeds com base no nextSlots e map_type
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

    // aplica o estado e o filtro
    setSlots(nextSlots);
    setRemainingSeeds(filtered);

    // se só sobrou 1 seed => navegar para resultado
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

            // opções considerando o slot como estava (para decidir se o slot aparece)
            const fullOptions = computeOptionsForSlot(slot.id, false);

            // opções do modal (exclui o valor atual — assim não aparece duplicado)
            const modalOptions = computeOptionsForSlot(slot.id, true);

            // regra: ocultar slots 01–27 quando só tiver 'empty' (mesmo comportamento anterior)
            if (/^(0?[1-9]|1[0-9]|2[0-7])$/.test(slot.id)) {
              // fullOptions contém 'empty' sempre; se for o único item, ocultamos
              if (fullOptions.length === 1 && fullOptions[0].id === "empty") {
                return null;
              }
            }

            const topPos = (slot.y / mapOriginalSize) * mapDisplaySize - iconScale / 2;
            const leftPos = (slot.x / mapOriginalSize) * mapDisplaySize - iconScale / 2;

            const iconSrc =
              slot.id === "nightlord"
                ? (nightlordIcons.find((b) => b.id === currentId)?.src ?? "/Images/buildingIcons/empty.webp")
                : (buildingIcons.find((b) => b.id === currentId)?.src ?? "/Images/buildingIcons/empty.webp");

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

          {/* Modal */}
          {activeSlot && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50 transition-opacity duration-150"
              onClick={() => setActiveSlot(null)} // fecha sem alterar (mantém estado)
            >
              <div
                className="bg-gray-800 border border-gray-400 rounded-lg p-6 max-w-[500px] w-full transform transition-all duration-150 scale-95 opacity-0 animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="grid gap-4"
                  style={{
                    gridTemplateColumns: `repeat(${maxColumns}, minmax(0, 1fr))`,
                  }}
                >
                  {computeOptionsForSlot(activeSlot, true).map((icon) => (
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
