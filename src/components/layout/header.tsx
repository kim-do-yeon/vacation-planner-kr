"use client";

const SECTIONS = [
  { id: "input", label: "입력" },
  { id: "recommendations", label: "추천" },
  { id: "calendar", label: "캘린더" },
  { id: "golden", label: "황금연휴" },
  { id: "flights", label: "항공료" },
  { id: "planner", label: "플래너" },
];

export function Header() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="text-lg font-bold">
          🏖️ 연차 플래너
        </button>
        <nav className="hidden gap-1 md:flex">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="rounded-md px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              {s.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
