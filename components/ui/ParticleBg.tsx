interface ParticleBgProps {
  opacity?: number;
  speed?: number;
}

export function ParticleBg({ opacity = 0.12, speed = 300 }: ParticleBgProps) {
  return (
    <img
      alt=""
      src="/particle.png"
      aria-hidden="true"
      className="absolute inset-0 object-cover pointer-events-none mix-blend-screen"
      style={{
        width: '200%',
        height: '200%',
        top: '-50%',
        left: '-50%',
        opacity,
        animation: `particle-spin ${speed}s linear infinite`,
        willChange: 'transform',
      }}
    />
  );
}
