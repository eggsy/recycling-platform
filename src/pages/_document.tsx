import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const title = "Recycling App";
  const description =
    "Wonder what happens if you don't recyle? Take a look at items on our database to see what impacts could be done if you recyle.";
  const themeColor = "#BF8D2C";
  const url = "https://recycling-app.netlify.app";

  return (
    <Html lang="en">
      <Head>
        <meta name="application-name" content={title} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={title} />
        <meta name="description" content={description} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content={themeColor} />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content={themeColor} />

        <link rel="apple-touch-icon" href="/icons/ios/512.png" />
        <link
          rel="apple-touch-icon"
          sizes="192x192"
          href="/icons/ios/192.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="512x512"
          href="/icons/ios/512.png"
        />

        <link rel="icon" type="image/png" href="/icons/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/ios/512.png" color={themeColor} />
        <link rel="shortcut icon" href="/favicon.ico" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content={url} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${url}/icons/ios/512.png`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:site_name" content={title} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${url}/icons/ios/512.png`} />
      </Head>

      <body className="overflow-x-hidden bg-[url('/background.png')] bg-cover bg-fixed bg-center">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
