import Image from "next/image";
import { Inter } from "next/font/google";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="flex w-full">
        <div className="w-1/2">
          <h1 className="text-2xl font-bold mb-8">
            Partager vos photos avec vos clients n&apos;a jamais été aussi
            facile.
          </h1>
          <Link href="/client" className="btn-link">
            Accéder à votre galerie
          </Link>
        </div>
        <div className="w-1/2">
          <Image
            src="/images/CJ-459.jpg"
            height="300"
            width="300"
            alt="Partager vos photos avec vos clients n'a jamais été aussi facile."
          />
        </div>
      </div>
    </main>
  );
}
