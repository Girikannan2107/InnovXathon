'use client';

import { useEffect, useRef } from 'react';

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => value * value * (3 - 2 * value);

export default function ParticleRegister({
  onRegister,
  buttonText = 'Submit',
}: {
  onRegister: () => void;
  buttonText?: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const button = buttonRef.current;
    if (!stage || !canvas || !button) return;

    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0,
      height = 0,
      animation = 0,
      progress = 0,
      inView = false,
      isPageActive = document.visibilityState === 'visible';
    let needsMeasure = true;
    let isDrawing = false;
    let seed = 731;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const isMobile = window.innerWidth < 640;
    const particleCount = isMobile ? 120 : 220;
    const particles = Array.from({ length: particleCount }, (_, index) => ({
      side: index % 2 ? 1 : -1,
      spread: random(),
      vertical: random(),
      phase: random() * Math.PI * 2,
      brightness: random(),
      delay: random() * 0.13,
    }));
    let targets: { x: number; y: number }[] = [];

    function resize() {
      if (!stage || !canvas || !button) return;
      width = stage.clientWidth;
      height = stage.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.25);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context!.setTransform(ratio, 0, 0, ratio, 0, 0);
      const mask = document.createElement('canvas');
      mask.width = Math.ceil(width);
      mask.height = Math.ceil(height);
      const ink = mask.getContext('2d', { willReadFrequently: true })!;
      const bw = button.offsetWidth,
        bh = button.offsetHeight;
      ink.strokeStyle = 'white';
      ink.lineWidth = 2;
      ink.beginPath();
      ink.roundRect((width - bw) / 2, (height - bh) / 2, bw, bh, bh / 2);
      ink.stroke();
      ink.fillStyle = 'white';
      ink.font = '500 22px Arial';
      ink.textAlign = 'center';
      ink.textBaseline = 'middle';
      ink.fillText(buttonText, width / 2, height / 2 + 1);
      const pixels = ink.getImageData(0, 0, mask.width, mask.height).data;
      targets = [];
      const step = isMobile ? 4 : 3;
      for (let y = 0; y < mask.height; y += step) {
        for (let x = 0; x < mask.width; x += step) {
          if (pixels[(y * mask.width + x) * 4 + 3] > 60) targets.push({ x, y });
        }
      }
      needsMeasure = true;
    }

    function measure() {
      if (!stage || !button) return;
      const bounds = stage.getBoundingClientRect();
      const viewport = window.innerHeight;
      const center = bounds.top + bounds.height / 2;
      progress = motion.matches
        ? 1
        : clamp((viewport * 0.94 - center) / (viewport * 0.43));
      inView = bounds.bottom > -50 && bounds.top < viewport + 50;
      const reveal = smooth(clamp((progress - 0.8) / 0.2));
      stage.style.setProperty('--button-reveal', String(reveal));
      stage.style.setProperty('--button-blur', `${(1 - reveal) * 5}px`);
      button.style.pointerEvents = reveal > 0.85 ? 'auto' : 'none';
      needsMeasure = false;
    }

    const onScroll = () => {
      needsMeasure = true;
      if (!isDrawing && inView && isPageActive && !motion.matches) {
        isDrawing = true;
        animation = requestAnimationFrame(draw);
      }
    };

    const handleVisibilityChange = () => {
      isPageActive = document.visibilityState === 'visible';
      if (isPageActive && inView && !motion.matches && !isDrawing) {
        isDrawing = true;
        animation = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    function draw(now: number) {
      if (!isPageActive || motion.matches) {
        isDrawing = false;
        return;
      }

      if (needsMeasure) measure();

      if (!inView) {
        isDrawing = false;
        return;
      }

      context!.clearRect(0, 0, width, height);
      if (targets.length) {
        const t = now / 1000;
        const fade = 1 - smooth(clamp((progress - 0.87) / 0.13));
        particles.forEach((particle, index) => {
          const target = targets[(index * 37) % targets.length];
          const amount = smooth(
            clamp((progress - particle.delay) / (1 - particle.delay)),
          );
          const originX =
            width / 2 +
            particle.side * width * (0.34 + particle.spread * 0.15);
          const originY = height * (0.1 + particle.vertical * 0.8);
          const arc = Math.sin(amount * Math.PI);
          const x = originX + (target.x - originX) * amount;
          const y =
            originY +
            (target.y - originY) * amount +
            arc * Math.sin(particle.phase) * height * 0.3;
          const alpha = (0.3 + particle.brightness * 0.65) * fade;
          context!.fillStyle = `rgba(226,239,255,${alpha * (0.82 + Math.sin(t * 1.3 + particle.phase) * 0.18)})`;
          context!.beginPath();
          context!.arc(
            x,
            y,
            particle.brightness > 0.95 ? 1.5 : 0.75,
            0,
            Math.PI * 2,
          );
          context!.fill();
        });
      }

      animation = requestAnimationFrame(draw);
    }

    stage.classList.add('particle-ready');
    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    observer.observe(button);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    motion.addEventListener('change', onScroll);
    resize();
    measure();

    if (inView && !motion.matches) {
      isDrawing = true;
      animation = requestAnimationFrame(draw);
    }

    return () => {
      if (animation) cancelAnimationFrame(animation);
      isDrawing = false;
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      motion.removeEventListener('change', onScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      stage.classList.remove('particle-ready');
    };
  }, []);

  return (
    <div className="particle-register" ref={stageRef}>
      <canvas ref={canvasRef} aria-hidden="true" />
      <button ref={buttonRef} className="formed-register" onClick={onRegister}>
        {buttonText}
      </button>
    </div>
  );
}
