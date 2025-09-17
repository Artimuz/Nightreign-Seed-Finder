import { useRouter } from "next/router";
import Head from "next/head"; 
import Image from "next/image";

export default function ResultPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title> Seed {id}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative flex flex-col items-center">
        <div className="flex justify-between w-full max-w-[1200px] p-4">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-gray-700 text-white rounded"
          >
            New Seed
          </button>
        </div>

        <h1 className="text-xl font-bold mb-4"></h1>
        <Image
          src={`https://thefifthmatt.github.io/nightreign/pattern/${id}.jpg`}
          alt={`Seed ${id}`}
          width={1000}
          height={1000}
        />

        <p className="mt-4 text-sm text-gray-200">
          Seed found {id}. Source: <a href="https://thefifthmatt.github.io/nightreign/" className="underline">thefifthmatt</a>
        </p>
      </div>
    </>
  );
}
