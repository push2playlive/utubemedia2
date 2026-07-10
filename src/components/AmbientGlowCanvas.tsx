import React, { useEffect, useRef } from 'react';
import { Video } from '../types';

interface AmbientGlowCanvasProps {
  video: Video;
}

export default function AmbientGlowCanvas({ video }: AmbientGlowCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sourceRef = useRef<HTMLVideoElement | HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const updateGlow = () => {
      // Proactively search and cache the active playing video/canvas inside the theatre wrapper
      if (!sourceRef.current || !document.body.contains(sourceRef.current)) {
        sourceRef.current = document.querySelector(
          '#video-player-theatre-wrapper video, #video-player-theatre-wrapper canvas'
        ) as HTMLVideoElement | HTMLCanvasElement | null;
      }

      const source = sourceRef.current;
      if (source && canvas) {
        try {
          // Draw the current frame onto our small 64x36 canvas
          // Resizing automatically blends the colors smoothly
          ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
        } catch (e) {
          // Silently handle occasional browser frame loading errors or security rules
        }
      }

      animationId = requestAnimationFrame(updateGlow);
    };

    // Low resolution ensures maximum rendering speed and soft natural averaging of colors
    canvas.width = 64;
    canvas.height = 36;

    animationId = requestAnimationFrame(updateGlow);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [video.id]);

  return (
    <canvas
      ref={canvasRef}
      id="video-theatre-ambient-glow"
      className="absolute inset-0 w-full h-full -z-10 pointer-events-none rounded-2xl opacity-65 select-none scale-[1.08] saturate-[1.8]"
      style={{
        filter: 'blur(55px)',
        transform: 'translate3d(0, 0, 0)', // Force hardware-acceleration layer
      }}
    />
  );
}
