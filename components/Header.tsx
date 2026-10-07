
export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#ded8cc] bg-[#f6f2e9]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center px-5 py-4 sm:px-8 lg:px-12">
        <a
          href="#top"
          className="shrink-0 whitespace-nowrap text-left text-base font-medium tracking-tight text-[#282722] sm:text-2xl"
        >
          <span className="text-serif italic">Mai Chi đít bự</span>
          <span className="ml-2 text-xs text-[#873f43]">✦</span>
        </a>
      </div>
    </header>
  );
}
