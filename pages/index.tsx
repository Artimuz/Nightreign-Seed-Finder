import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

const mapTypes = [
  { id: "Normal", src: "/Images/mapTypes/normalIcon.webp" },
  { id: "Mountaintop", src: "/Images/mapTypes/mountainIcon.webp" },
  { id: "Crater", src: "/Images/mapTypes/craterIcon.webp" },
  { id: "Rotted Woods", src: "/Images/mapTypes/rotIcon.webp" },
  { id: "Noklateo, the Shrouded City", src: "/Images/mapTypes/noklateoIcon.webp" },
];

export default function HomePage() {
  const router = useRouter();

  const handleSelect = (mapType: string) => {
    router.push(`/map?type=${mapType}`);
  };

  return (
    <>
      <Head>
        <title>Nightreign Seed Finder</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-2xl font-bold mb-6">Select your map</h1>
        <div className="grid grid-cols-3 gap-4">
          {mapTypes.map((map) => (
            <button
              key={map.id}
              onClick={() => handleSelect(map.id)}
              className="hover:scale-105 transition"
            >
              <Image
                src={map.src}
                alt={map.id}
                width={350}
                height={350}
                className="object-contain"
              />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
