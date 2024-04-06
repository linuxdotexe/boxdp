import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const inter = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "boxd-pics",
  description: "Get a prettier image of your letterboxd review. Just provide the URL.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {children}

        <footer>
          <div className="w-full bg-gradient-to-r from-orange-600 via-green-600 to-sky-600 p-0.5">
            <div className="flex flex-row justify-around items-center z-10">
              <a href="https://www.themoviedb.org/"><p>TMDB</p></a>
              <a href="https://boxdp.vercel.app/"><p>boxd-pics</p></a>
              <a href="https://letterboxd.com/"><p>Letterboxd</p></a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
