import Image from "next/image";
import { useRouter } from "next/router";

const mapTypes = [
  { id: "Normal", src: "/Images/mapTypes/normalIcon.jpg" },
  { id: "Mountaintop", src: "/Images/mapTypes/mountainIcon.jpg" },
  { id: "Crater", src: "/Images/mapTypes/craterIcon.jpg" },
  { id: "Rotted Woods", src: "/Images/mapTypes/rotIcon.jpg" },
  { id: "Noklateo, the Shrouded City", src: "/Images/mapTypes/noklateoIcon.jpg" },
];

export default function HomePage() {
  const router = useRouter();

  const handleSelect = (mapType: string) => {
    router.push(`/map?type=${mapType}`);
  };

  return (
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
  );
}
