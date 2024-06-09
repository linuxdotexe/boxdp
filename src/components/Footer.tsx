export default function Footer() {
  return (
    <footer className="w-full sm:w-3/4 md:w-4/5 lg:w-4/6 xl:w-1/3 border-t-2 border-neutral-800 p-2.5 m-auto mb-0">
      <p className="p-3 text-center w-full text-base md:text-lg">
        Made with {"<3"} by{" "}
        <a
          href="https://letterboxd.com/kenough_"
          target="blank"
          rel="_noreferrer"
          className="text-blue-400">
          @kenough_
        </a>{" "}
        and{" "}
        <a
          href="https://github.com/abhishekyelley"
          target="blank"
          rel="_noreferrer"
          className="text-blue-400">
          abhishekyelley
        </a>
      </p>
    </footer>
  );
}
