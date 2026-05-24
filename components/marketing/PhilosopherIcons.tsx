'use client';

import { useEffect, useRef } from 'react';

interface PhilosopherIconProps {
  type: 'aristotle' | 'pixar' | 'campbell' | 'cicero' | 'synthesis';
  className?: string;
}

// Each icon is a minimal SVG composition — abstract, not literal
const paths: Record<PhilosopherIconProps['type'], string[]> = {
  // Aristotle — three stacked columns (structure)
  aristotle: [
    'M8 28 L8 12',
    'M16 28 L16 8',
    'M24 28 L24 14',
    'M5 28 L27 28',
  ],
  // Pixar — spine arc (story spine / "and then... but... therefore")
  pixar: [
    'M6 24 C6 24 10 8 16 8 C22 8 26 24 26 24',
    'M16 8 L16 24',
    'M12 16 L20 16',
  ],
  // Campbell — hero's circle (the journey returns)
  campbell: [
    'M16 6 A10 10 0 1 1 15.99 6',
    'M16 6 L16 10',
    'M16 22 L16 26',
    'M13 16 L16 13 L19 16',
  ],
  // Cicero — scroll with lines (rhetoric)
  cicero: [
    'M9 8 C7 8 6 9 6 11 L6 21 C6 23 7 24 9 24 L23 24 C25 24 26 23 26 21 L26 11 C26 9 25 8 23 8 Z',
    'M10 13 L22 13',
    'M10 17 L22 17',
    'M10 21 L18 21',
  ],
  // Synthesis — converging lines (voice found)
  synthesis: [
    'M6 22 L16 10',
    'M26 22 L16 10',
    'M8 22 L16 12 L24 22',
    'M11 22 L16 15 L21 22',
    'M16 10 L16 28',
  ],
};

export function PhilosopherIcon({ type, className = '' }: PhilosopherIconProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svgPaths = svgRef.current?.querySelectorAll<SVGPathElement>('path');
    if (!svgPaths) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            svgPaths.forEach((p, i) => {
              p.style.transitionDelay = `${i * 120}ms`;
              p.classList.add('drawn');
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    if (svgRef.current) observer.observe(svgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[type].map((d, i) => (
        <path
          key={i}
          d={d}
          className="philosopher-path"
        />
      ))}
    </svg>
  );
}
