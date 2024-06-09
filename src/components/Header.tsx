import Image from "next/image";
import Link from "next/link";
export default function Header() {
  return (
    <header className="w-full sm:w-3/4 md:w-4/5 lg:w-4/6 xl:w-1/3  border-b-2 border-neutral-800 p-2.5 m-auto mt-0">
      <a
        href="/"
        className="flex gap-2 justify-center">
        <Image
          src="/logo.png"
          width={50}
          height={50}
          alt="Logo"
          className=""
        />
        <h1
          className="hidden md:inline-block
        self-center text-xl">
          Boxd-Pics
        </h1>
      </a>
    </header>
  );
}
