import Footer from "@/components/footer";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import useLocale from "../hooks/useLocale";

const mapTypes = [
  { id: "Normal", src: "/Images/mapTypes/normalIcon.webp" },
  { id: "Mountaintop", src: "/Images/mapTypes/mountainIcon.webp" },
  { id: "Crater", src: "/Images/mapTypes/craterIcon.webp" },
  { id: "Rotted Woods", src: "/Images/mapTypes/rotIcon.webp" },
  { id: "Noklateo, the Shrouded City", src: "/Images/mapTypes/noklateoIcon.webp" },
];

export default function HomePage() {
  const router = useRouter();
  const { locale, texts, changeLocale, SUPPORTED_LOCALES } = useLocale();

  const handleSelect = (mapType: string) => {
    router.push(`/map?type=${mapType}`);
  };

  if (!locale) return null;

  return (
    <>
      <Head>
        <title>{texts.header?.mapTitle || "Seed Finder"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen">
        <header className="h-16 bg-gray-800 flex items-center justify-between px-6 relative">
          <p className="text-center text-lg font-semibold text-gray-200 flex-1">
            {texts.header?.mapTitle || "Seed Finder"}
          </p>
          <select
            value={locale}
            onChange={(e) => changeLocale(e.target.value)}
            className="bg-gray-700 text-white px-2 py-1 rounded"
          >
            {Object.entries(SUPPORTED_LOCALES).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="grid grid-cols-3 gap-4">
            {mapTypes.map((map) => (
              <button
                key={map.id}
                onClick={() => handleSelect(map.id)}
                className="hover:scale-105 transition-transform duration-150"
              >
                <Image
                  src={map.src}
                  alt={map.id}
                  width={250}
                  height={250}
                  className="object-contain"
                />
              </button>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
