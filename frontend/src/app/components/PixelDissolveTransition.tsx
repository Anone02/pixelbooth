import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface PixelDissolveTransitionProps {
  isActive: boolean;
  onComplete?: () => void;
}

export const PixelDissolveTransition: React.FC<PixelDissolveTransitionProps> = ({
  isActive,
  onComplete,
}) => {
  const [pixels, setPixels] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    if (isActive) {
      const pixelArray = [];
      const cols = 40;
      const rows = 30;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          pixelArray.push({
            id: row * cols + col,
            x: (col / cols) * 100,
            y: (row / rows) * 100,
            delay: Math.random() * 0.5,
          });
        }
      }

      setPixels(pixelArray);

      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {pixels.map((pixel) => (
        <motion.div
          key={pixel.id}
          className="absolute bg-black"
          style={{
            left: `${pixel.x}%`,
            top: `${pixel.y}%`,
            width: `${100 / 40}%`,
            height: `${100 / 30}%`,
            imageRendering: 'pixelated',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            duration: 0.3,
            delay: pixel.delay,
          }}
        />
      ))}
    </div>
  );
};
