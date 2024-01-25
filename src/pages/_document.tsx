import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="lg:w-[1200px] md:w-[760px] sm:w-[480px] w-10/12 m-auto">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
