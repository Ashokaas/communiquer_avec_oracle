import React, { useState, useEffect, useMemo } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { ISourceOptions } from '@tsparticles/engine';

export default function ParticlesBackground() {
  const [particlesReady, setParticlesReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async engine => {
      await loadSlim(engine);
    }).then(() => setParticlesReady(true));
  }, []);

  const ambientOptions = useMemo<ISourceOptions>(() => ({
    fullScreen: { enable: true, zIndex: 2 },
    background: { color: 'transparent' },
    particles: {
      number: { value: 90, density: { enable: true, area: 900 } },
      color: { value: ['#ffffff', '#d1d5db', '#9ca3af'] },
      opacity: { value: { min: 0.08, max: 0.25 } },
      size: { value: { min: 1, max: 3 } },
      move: { enable: true, speed: 0.35, direction: 'none', outModes: { default: 'out' }, drift: 0.05 },
      wobble: { enable: true, distance: 4, speed: 0.5 },
      links: { enable: false },
      rotate: { value: { min: 0, max: 360 }, direction: 'random', animation: { enable: true, speed: 5 } },
      shadow: { enable: true, blur: 6, color: '#111827' }
    },
    interactivity: {
      events: { onHover: { enable: false }, onClick: { enable: false }, resize: { enable: true } }
    },
    detectRetina: true
  }), []);

  if (!particlesReady) return null;

  return (
    <Particles
      id="oracle-ambient"
      options={ambientOptions}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2 }}
    />
  );
}
