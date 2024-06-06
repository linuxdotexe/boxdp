import Image from "next/image";
import Link from "next/link";
export default function Header() {
  return (
    <header className="w-full bg-neutral-900 p-2.5">
      <Link href="/">
        <Image
          src="/logo.png"
          width={50}
          height={50}
          alt="Logo"
          className="m-auto"
        />
      </Link>
    </header>
  );
}
