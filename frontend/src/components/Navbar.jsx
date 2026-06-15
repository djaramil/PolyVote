import { BarChart3 } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-edge/70 bg-ink/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center gap-6">
        <div className="flex items-center gap-2 font-extrabold text-lg">
          <span className="grid place-items-center h-8 w-8 rounded-xl bg-brand/20 text-brand">
            <BarChart3 className="h-5 w-5" />
          </span>
          Poly<span className="text-brand">Vote</span>
        </div>
        <nav className="hidden lg:flex items-center gap-1 text-sm">
          <button className="tab tab-active px-3 py-1.5 rounded-full border border-transparent">All</button>
          <button className="tab px-3 py-1.5 rounded-full border border-transparent hover:bg-surface2">Politics</button>
          <button className="tab px-3 py-1.5 rounded-full border border-transparent hover:bg-surface2">Technology</button>
          <button className="tab px-3 py-1.5 rounded-full border border-transparent hover:bg-surface2">Sports</button>
          <button className="tab px-3 py-1.5 rounded-full border border-transparent hover:bg-surface2">Business</button>
          <button className="tab px-3 py-1.5 rounded-full border border-transparent hover:bg-surface2">Science</button>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm rounded-lg hover:bg-surface2">Log in</button>
          <button className="px-3 py-1.5 text-sm rounded-lg bg-brand text-white font-medium hover:opacity-90">Sign up</button>
        </div>
      </div>
    </header>
  );
}
