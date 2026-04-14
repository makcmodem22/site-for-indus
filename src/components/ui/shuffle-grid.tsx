'use client'
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────
   RR Granites — adapted for the Gallery section.
   The 25 squares cycle through real luxury stone
   project images from Unsplash.
   ───────────────────────────────────────── */

const verifiedImages = [
  "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/210265/pexels-photo-210265.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3214064/pexels-photo-3214064.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/2086622/pexels-photo-2086622.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1358900/pexels-photo-1358900.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1599791/pexels-photo-1599791.jpeg?auto=compress&cs=tinysrgb&w=800",
];

// Generate exactly 25 items by cycling the verified pristine kitchen photos
const squareData = Array.from({ length: 25 }).map((_, i) => ({
  id: i + 1,
  src: verifiedImages[i % verifiedImages.length],
}));

const shuffle = (array: (typeof squareData)[number][]) => {
  const arr = [...array];
  let currentIndex = arr.length;
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
  }
  return arr;
};

const generateSquares = (isInitial = false) =>
  (isInitial ? squareData : shuffle(squareData)).map((sq) => (
    <motion.div
      key={sq.id}
      layout
      transition={{ duration: 1.5, type: "spring" }}
      className="w-full h-full rounded-xl overflow-hidden bg-[#111]"
      style={{
        backgroundImage: `url(${sq.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  ));

/* ── Animated shuffle grid ── */
const ShuffleGrid = () => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [squares, setSquares] = useState(() => generateSquares(true));

  const shuffleSquares = () => {
    setSquares(generateSquares(false));
    timeoutRef.current = setTimeout(shuffleSquares, 3000);
  };

  useEffect(() => {
    shuffleSquares();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid grid-cols-5 grid-rows-5 h-[550px] gap-2">
      {squares}
    </div>
  );
};

/* ── Public hero section — drop-in replacement for GallerySection ── */
export const ShuffleHero = ({ className }: { className?: string }) => {
  return (
    <section
      className={cn(
        "w-full px-8 py-24 md:py-32 grid grid-cols-1 md:grid-cols-2 items-center gap-12 max-w-7xl mx-auto",
        className
      )}
    >
      {/* Left: copy */}
      <div>
        {/* Label */}
        <p
          className="block mb-4 text-[11px] font-semibold uppercase tracking-[0.3em]"
          style={{ color: "#c9a962", fontFamily: "'Inter', sans-serif" }}
        >
          Portfolio
        </p>

        {/* Heading */}
        <h2
          className="text-4xl md:text-5xl font-semibold tracking-tight text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Our Recent
          <br />
          <span
            className="italic"
            style={{ color: "#c9a962" }}
          >
            Transformations
          </span>
        </h2>

        {/* Body */}
        <p
          className="text-base md:text-lg my-6 max-w-md leading-relaxed"
          style={{ color: "#6b7280", fontFamily: "'Inter', sans-serif" }}
        >
          Every project is a testament to precision and artistry. Watch how our
          granite, quartz, and marble installations come to life — shuffled live
          from our portfolio.
        </p>

        {/* Feature list */}
        <ul className="space-y-2.5 mb-8">
          {[
            "Granite · Quartz · Marble",
            "Worktops, Islands & Vanities",
            "London & Kent — delivered in 7 days",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-2.5 text-sm"
              style={{ color: "#9ca3af", fontFamily: "'Inter', sans-serif" }}
            >
              <span
                className="inline-block h-1.5 w-1.5 rounded-full flex-shrink-0"
                style={{ background: "#c9a962" }}
              />
              {item}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <a
          href="#contact"
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold",
            "transition-all duration-300",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          )}
          style={{
            background: "linear-gradient(to right, #c9a962, #b8983f)",
            color: "#1a1a1a",
          }}
        >
          Request a Free Quote
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      {/* Right: live-shuffling grid */}
      <ShuffleGrid />
    </section>
  );
};
