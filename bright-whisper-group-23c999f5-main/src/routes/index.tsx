import { createFileRoute } from "@tanstack/react-router";
import atmosphere from "@/assets/atmosphere.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-cream text-sage-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 px-6 py-4 bg-cream/80 backdrop-blur-md flex justify-between items-center">
        <span className="font-serif text-xl italic tracking-tight text-sage-800">MindCircle</span>
        <button className="text-sm font-medium px-4 py-1.5 rounded-full ring-1 ring-black/5 bg-sage-100 text-sage-800 transition-transform active:scale-95">
          Menu
        </button>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-8 pb-16 overflow-hidden">
        <div className="relative">
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-sage-200/40 rounded-full blur-3xl -z-10 animate-pulse" />
          <span className="inline-block px-3 py-1 rounded-full bg-sage-100 text-sage-800 text-xs font-medium tracking-wide mb-6 ring-1 ring-sage-800/10">
            By students, for students
          </span>
          <h1 className="font-serif text-5xl leading-tight text-balance mb-6 text-sage-950">
            A quiet space to <span className="italic">be heard</span>
          </h1>
          <p className="text-lg leading-relaxed text-pretty text-sage-800/80 mb-8 max-w-[35ch]">
            Join small, anonymous support groups facilitated by AI designed to make every voice feel safe.
          </p>
          <div className="flex flex-col gap-3">
            <button className="w-full py-4 px-6 bg-sage-800 text-cream rounded-full font-medium text-base ring-2 ring-sage-800/10 shadow-sm transition-transform active:scale-[0.98]">
              Find your circle
            </button>
            <button className="w-full py-4 px-6 bg-transparent text-sage-800 rounded-full font-medium text-base ring-1 ring-black/5 transition-colors hover:bg-black/5">
              See how it works
            </button>
          </div>
        </div>
      </section>

      {/* Circles */}
      <section className="bg-sage-50 py-20 px-6">
        <h2 className="font-serif text-3xl mb-12 text-balance">Explore our circles</h2>
        <div className="space-y-6">
          <div className="relative ml-4 p-6 bg-cream rounded-[24px] ring-1 ring-black/5 shadow-sm">
            <div className="size-10 bg-sage-100 rounded-full flex items-center justify-center mb-4">
              <svg viewBox="0 0 16 16" fill="currentColor" className="size-4 text-sage-800">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
              </svg>
            </div>
            <h3 className="font-medium text-lg mb-2">Academic Pressure</h3>
            <p className="text-sm text-sage-800/70 leading-relaxed text-pretty max-w-[28ch]">
              Navigating finals, expectations, and the weight of the next step.
            </p>
          </div>

          <div className="relative mr-4 p-6 bg-sage-800 text-cream rounded-[24px] ring-1 ring-sage-800/10 shadow-lg translate-y-2">
            <div className="size-10 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
                <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm.75-10.25v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5a.75.75 0 0 1 1.5 0Z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="font-medium text-lg mb-2">Burnout & Rest</h3>
            <p className="text-sm text-cream/70 leading-relaxed text-pretty max-w-[28ch]">
              Learning to breathe when the world feels too fast and demanding.
            </p>
          </div>

          <div className="relative ml-8 p-6 bg-cream rounded-[24px] ring-1 ring-black/5 shadow-sm">
            <div className="size-10 bg-sage-100 rounded-full flex items-center justify-center mb-4">
              <svg viewBox="0 0 16 16" fill="currentColor" className="size-4 text-sage-800">
                <path d="M2 8a6 6 0 1 1 12 0A6 6 0 0 1 2 8Zm6-3a.75.75 0 0 0-.75.75v2.25H5a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 .75-.75V5.75A.75.75 0 0 0 8 5Z" />
              </svg>
            </div>
            <h3 className="font-medium text-lg mb-2">Social Anxiety</h3>
            <p className="text-sm text-sage-800/70 leading-relaxed text-pretty max-w-[28ch]">
              Finding comfort in connection without the fear of judgment.
            </p>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-6">
        <div className="mb-12">
          <span className="font-serif italic text-lg text-sage-800/60">The Experience</span>
          <h2 className="text-3xl font-serif mt-2">Guided by soft intelligence</h2>
        </div>

        <div className="space-y-12">
          {[
            { n: "01", t: "Gentle Entry", d: "Answer three soft questions about your current state. No forms, just feelings." },
            { n: "02", t: "AI-Led Safety", d: "Our AI facilitator structures the talk, ensuring everyone is heard and the space stays kind." },
            { n: "03", t: "Radical Privacy", d: "Everything is anonymous. Your identity stays yours; only your support is shared." },
          ].map((s) => (
            <div key={s.n} className="flex gap-6 items-start">
              <span className="text-3xl font-serif text-sage-200">{s.n}</span>
              <div>
                <h3 className="font-medium text-base mb-2">{s.t}</h3>
                <p className="text-sm text-sage-800/70 text-pretty leading-relaxed">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual */}
      <section className="px-6">
        <img
          src={atmosphere}
          alt="Sunlit reading nook with a soft knit blanket draped on an armchair"
          width={1080}
          height={1440}
          loading="lazy"
          className="w-full aspect-[3/4] object-cover rounded-[32px] outline-1 -outline-offset-1 outline-black/5"
        />
      </section>

      {/* Quote */}
      <section className="py-24 px-6 text-center">
        <p className="font-serif text-2xl italic leading-snug text-sage-950 mb-6">
          “For the first time, I felt like I wasn’t carrying the weight of my degree alone.”
        </p>
        <span className="text-xs font-medium uppercase tracking-widest text-sage-800/50">
          Sophomore, Art History
        </span>
      </section>

      {/* Footer CTA */}
      <footer className="mt-auto bg-sage-950 text-cream px-6 pt-20 pb-12 rounded-t-[40px]">
        <h2 className="font-serif text-4xl mb-8 text-balance">Take a seat in the circle.</h2>
        <button className="flex items-center justify-between w-full py-4 pr-3 pl-6 bg-cream text-sage-950 rounded-full font-medium text-sm transition-transform active:scale-95 mb-16">
          Join a group today
          <span className="size-8 bg-sage-950 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 16 16" fill="currentColor" className="size-4 text-cream">
              <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
            </svg>
          </span>
        </button>
        <div className="flex justify-between items-end border-t border-cream/10 pt-8">
          <div className="flex flex-col gap-2">
            <span className="font-serif italic text-xl">MindCircle</span>
            <span className="text-[10px] opacity-40 uppercase tracking-tighter italic">
              Safety First · Always Free
            </span>
          </div>
          <div className="flex flex-col text-right gap-1 opacity-60 text-xs">
            <span>Privacy Policy</span>
            <span>Terms of Care</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
