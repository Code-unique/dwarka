'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[80vh] bg-gradient-to-br from-[#3a6e61] via-[#5ca78c] to-[#2f5e50] flex flex-col items-center justify-center px-6 py-24 overflow-hidden text-white">
      
      {/* Background big text */}
      <h2
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center font-serif font-extrabold text-[12rem] md:text-[16rem] leading-none tracking-wide opacity-10 select-none pointer-events-none text-white"
        style={{ textShadow: '1px 1px 8px rgba(0,0,0,0.4)' }}
      >
        DWARKA
      </h2>

      {/* Foreground content container */}
      <div className="relative max-w-4xl text-center z-10 animate-fadeInScale">
        <h1 className="text-5xl md:text-6xl font-serif font-bold leading-tight mb-6 drop-shadow-lg">
          Sustainable Fashion<br />Rooted in Nepal
        </h1>

        <p className="text-[#d4f0e1] text-lg md:text-xl max-w-xl mx-auto mb-12 tracking-wide drop-shadow-md">
          Discover timeless designs handcrafted with organic fabrics — linen, hemp, and cotton — for conscious living.
        </p>

        <Link href="/#products" passHref>
          <button className="relative inline-block px-10 py-4 rounded-full font-semibold text-lg text-white shadow-lg overflow-hidden animate-glow-multicolor">
            Explore the Collection
            <span className="absolute inset-0 rounded-full opacity-70 blur-xl"></span>
          </button>
        </Link>
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeInScale {
          animation: fadeInScale 1s ease forwards;
        }

        @keyframes glowColors {
          0% {
            box-shadow:
              0 0 6px #6aa88f,
              0 0 12px #6aa88f,
              0 0 18px #a0e7a0,
              0 0 24px #6aa88f;
          }
          25% {
            box-shadow:
              0 0 6px #7f6aa8,
              0 0 12px #7f6aa8,
              0 0 18px #a0a0e7,
              0 0 24px #7f6aa8;
          }
          50% {
            box-shadow:
              0 0 6px #a86a6a,
              0 0 12px #a86a6a,
              0 0 18px #e7a0a0,
              0 0 24px #a86a6a;
          }
          75% {
            box-shadow:
              0 0 6px #6aa8a0,
              0 0 12px #6aa8a0,
              0 0 18px #a0e7e7,
              0 0 24px #6aa8a0;
          }
          100% {
            box-shadow:
              0 0 6px #6aa88f,
              0 0 12px #6aa88f,
              0 0 18px #a0e7a0,
              0 0 24px #6aa88f;
          }
        }

        .animate-glow-multicolor {
          animation: glowColors 6s ease-in-out infinite alternate;
          position: relative;
          z-index: 0;
          background: linear-gradient(to right, #6aa88f, #8bc9a8, #6aa88f);
          border: none;
          cursor: pointer;
          transition: filter 0.3s ease;
        }
        .animate-glow-multicolor:hover {
          filter: brightness(1.2);
        }
      `}</style>
    </section>
  );
}
