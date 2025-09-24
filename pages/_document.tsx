import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta property="og:title" content="Nightreign Seed Finder" />
        <meta property="og:description" content="Easily find seeds and maps for Nightreign!" />
        <meta property="og:image" content="/favicon.ico" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://seulink.com/" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Nightreign Seed Finder" />
        <meta name="twitter:description" content="Easily find seeds and maps for Nightreign!" />
        <meta name="twitter:image" content="/favicon.ico" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
