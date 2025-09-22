import React from "react";
import { useLocale } from "@/hooks/LocaleContext";

export default function Footer() {
  const { texts } = useLocale();

  return (
    <footer className="w-full bg-gray-900 text-gray-300 text-sm py-4 flex justify-center items-center">
      <p>
        <a
          href="https://github.com/Artimuz/Nightreign-Seed-Finder"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          {texts.footer.githubRepository}
        </a>
      </p>
    </footer>
  );
}
