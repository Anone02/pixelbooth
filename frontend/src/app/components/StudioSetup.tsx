import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { Camera } from 'lucide-react';

interface StudioSetupProps {
  onStartShooting: (config: ShootingConfig) => void;
  onBack: () => void;
}

export interface ShootingConfig {
  orientation: 'portrait' | 'landscape';
  shotCount: 1 | 2 | 4 | 6;
}

export const StudioSetup: React.FC<StudioSetupProps> = ({ onStartShooting, onBack }) => {
  const { currentTheme } = useTheme();
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [shotCount, setShotCount] = useState<1 | 2 | 4 | 6>(4);

  const handleStart = () => {
    onStartShooting({ orientation, shotCount });
  };

  return (
    <div
      className="min-h-screen p-8 flex flex-col items-center justify-center transition-colors duration-500"
      style={{
        backgroundColor: currentTheme.colors.background,
        imageRendering: 'pixelated',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2
          className="text-2xl md:text-3xl text-center"
          style={{
            fontFamily: currentTheme.font,
            color: currentTheme.colors.text,
          }}
        >
          STUDIO SETUP
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className="border-4 p-8"
            style={{
              borderColor: currentTheme.colors.border,
              backgroundColor: 'white',
              boxShadow: `8px 8px 0 ${currentTheme.colors.primary}`,
            }}
          >
            <h3
              className="text-lg mb-6"
              style={{
                fontFamily: currentTheme.font,
                color: currentTheme.colors.text,
              }}
            >
              ORIENTATION
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                onClick={() => setOrientation('portrait')}
                className="border-4 p-4 transition-all"
                style={{
                  borderColor: currentTheme.colors.border,
                  backgroundColor: orientation === 'portrait' ? currentTheme.colors.primary : 'white',
                  color: orientation === 'portrait' ? 'white' : currentTheme.colors.text,
                  fontFamily: currentTheme.font,
                  boxShadow: orientation === 'portrait' ? `6px 6px 0 ${currentTheme.colors.secondary}` : '4px 4px 0 rgba(0,0,0,0.2)',
                }}
              >
                <div className="w-full h-24 border-2 border-current mb-2 mx-auto" style={{ width: '60px' }} />
                <div className="text-xs">PORTRAIT</div>
              </button>

              <button
                onClick={() => setOrientation('landscape')}
                className="border-4 p-4 transition-all"
                style={{
                  borderColor: currentTheme.colors.border,
                  backgroundColor: orientation === 'landscape' ? currentTheme.colors.primary : 'white',
                  color: orientation === 'landscape' ? 'white' : currentTheme.colors.text,
                  fontFamily: currentTheme.font,
                  boxShadow: orientation === 'landscape' ? `6px 6px 0 ${currentTheme.colors.secondary}` : '4px 4px 0 rgba(0,0,0,0.2)',
                }}
              >
                <div className="w-full h-16 border-2 border-current mb-2" />
                <div className="text-xs">LANDSCAPE</div>
              </button>
            </div>

            <h3
              className="text-lg mb-6"
              style={{
                fontFamily: currentTheme.font,
                color: currentTheme.colors.text,
              }}
            >
              SHOT COUNT
            </h3>

            <div className="grid grid-cols-4 gap-3">
              {([1, 2, 4, 6] as const).map((count) => (
                <button
                  key={count}
                  onClick={() => setShotCount(count)}
                  className="border-4 p-4 transition-all aspect-square"
                  style={{
                    borderColor: currentTheme.colors.border,
                    backgroundColor: shotCount === count ? currentTheme.colors.secondary : 'white',
                    color: shotCount === count ? 'white' : currentTheme.colors.text,
                    fontFamily: currentTheme.font,
                    boxShadow: shotCount === count ? `6px 6px 0 ${currentTheme.colors.accent}` : '4px 4px 0 rgba(0,0,0,0.2)',
                  }}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div
            className="border-4 p-8 h-full"
            style={{
              borderColor: currentTheme.colors.border,
              backgroundColor: 'white',
              boxShadow: `8px 8px 0 ${currentTheme.colors.secondary}`,
            }}
          >
            <h3
              className="text-lg mb-6"
              style={{
                fontFamily: currentTheme.font,
                color: currentTheme.colors.text,
              }}
            >
              PREVIEW
            </h3>

            <GridPreview orientation={orientation} shotCount={shotCount} theme={currentTheme} />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex gap-4"
      >
        <button
          onClick={onBack}
          className="border-4 px-8 py-4 transition-all"
          style={{
            borderColor: currentTheme.colors.border,
            backgroundColor: 'white',
            color: currentTheme.colors.text,
            fontFamily: currentTheme.font,
            boxShadow: `6px 6px 0 rgba(0,0,0,0.3)`,
          }}
        >
          BACK
        </button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="border-4 px-8 py-4 transition-all flex items-center gap-3"
          style={{
            borderColor: currentTheme.colors.border,
            backgroundColor: currentTheme.colors.accent,
            color: currentTheme.colors.text,
            fontFamily: currentTheme.font,
            boxShadow: `8px 8px 0 ${currentTheme.colors.primary}`,
          }}
        >
          <Camera size={24} />
          START CAMERA
        </motion.button>
      </motion.div>
    </div>
  );
};

const GridPreview: React.FC<{ orientation: 'portrait' | 'landscape'; shotCount: number; theme: any }> = ({
  orientation,
  shotCount,
  theme,
}) => {
  const getGridLayout = () => {
    if (shotCount === 1) return { cols: 1, rows: 1 };
    if (shotCount === 2) return orientation === 'portrait' ? { cols: 1, rows: 2 } : { cols: 2, rows: 1 };
    if (shotCount === 4) return { cols: 2, rows: 2 };
    if (shotCount === 6) return orientation === 'portrait' ? { cols: 2, rows: 3 } : { cols: 3, rows: 2 };
    return { cols: 2, rows: 2 };
  };

  const { cols, rows } = getGridLayout();

  return (
    <div
      className="w-full border-4 p-4"
      style={{
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.background,
        aspectRatio: orientation === 'portrait' ? '3/4' : '4/3',
      }}
    >
      <div
        className="grid gap-2 w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {Array.from({ length: shotCount }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="border-2 flex items-center justify-center text-4xl"
            style={{
              borderColor: theme.colors.border,
              backgroundColor: 'white',
            }}
          >
            📷
          </motion.div>
        ))}
      </div>
    </div>
  );
};
