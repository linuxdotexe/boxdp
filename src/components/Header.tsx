import Image from "next/image";
export default function Header() {
  return (
    <header className="w-full bg-neutral-900 p-2.5">
      <Image
        src="/logo.png"
        width={50}
        height={50}
        alt="Logo"
        className="m-auto"
      />
    </header>
  );
}
