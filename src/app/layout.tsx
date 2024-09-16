import type { Metadata } from "next";
import { Karla } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

// const inter = Karla({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "boxd-pics",
  description:
    "Get a prettier image of your letterboxd review. Just provide the URL.",
  openGraph: {
    images: ["/og.png"],
  },
};

const fh: React.CSSProperties = {
  height: "100vh", // Set the height value here
  // You can add more CSS properties as needed
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="scroll-smooth"
    >
      {/* <body className={inter.className}> */}
      <body>
        <div
          className="flex flex-col h-screen justify-between"
          style={fh}
        >
          <Header />
          <div className="mb-auto">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
