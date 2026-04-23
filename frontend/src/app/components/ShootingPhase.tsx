import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useSoundEffect } from '../hooks/useSoundEffect';
import { ShootingConfig } from './StudioSetup';

interface ShootingPhaseProps {
  config: ShootingConfig;
  onComplete: (photos: string[]) => void;
  onBack: () => void;
}

export const ShootingPhase: React.FC<ShootingPhaseProps> = ({ config, onComplete, onBack }) => {
  const { currentTheme } = useTheme();
  const { playSound } = useSoundEffect();
  const webcamRef = useRef<Webcam>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showFlash, setShowFlash] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const capturePhoto = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setPhotos((prev) => [...prev, imageSrc]);

        setShowFlash(true);
        playSound('capture');

        if (navigator.vibrate) {
          navigator.vibrate(200);
        }

        setTimeout(() => {
          setShowFlash(false);
        }, 200);
      }
    }
  }, [playSound]);

  const startCountdown = useCallback(() => {
    if (isCapturing) return;

    setIsCapturing(true);
    setCountdown(3);
    playSound('countdown');

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          setTimeout(() => {
            capturePhoto();
            setCountdown(null);
            setIsCapturing(false);
          }, 100);
          return null;
        }
        playSound('countdown');
        return prev - 1;
      });
    }, 1000);
  }, [capturePhoto, isCapturing, playSound]);

  useEffect(() => {
    if (photos.length > 0 && photos.length < config.shotCount) {
      const timer = setTimeout(() => {
        startCountdown();
      }, 2000);
      return () => clearTimeout(timer);
    } else if (photos.length === config.shotCount) {
      playSound('complete');
      const timer = setTimeout(() => {
        onComplete(photos);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [photos, config.shotCount, startCountdown, onComplete, playSound]);

  const videoConstraints = {
    width: config.orientation === 'portrait' ? 480 : 640,
    height: config.orientation === 'portrait' ? 640 : 480,
    facingMode: 'user',
  };

  return (
    <div
      className="min-h-screen p-8 flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundColor: currentTheme.colors.background,
        imageRendering: 'pixelated',
      }}
    >
      <ParticleEffect theme={currentTheme} />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-6"
      >
        <h2
          className="text-xl text-center"
          style={{
            fontFamily: currentTheme.font,
            color: currentTheme.colors.text,
          }}
        >
          {currentTheme.name.toUpperCase()}
        </h2>
      </motion.div>

      <div className="relative">
        <div
          className="relative border-8"
          style={{
            borderColor: currentTheme.colors.border,
            boxShadow: `12px 12px 0 ${currentTheme.colors.primary}`,
          }}
        >
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="block"
            style={{
              width: config.orientation === 'portrait' ? '480px' : '640px',
              height: config.orientation === 'portrait' ? '640px' : '480px',
              imageRendering: 'auto',
            }}
          />

          <ThemedFrameOverlay theme={currentTheme} />

          <AnimatePresence>
            {countdown !== null && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center z-20"
              >
                <div
                  className="text-9xl"
                  style={{
                    fontFamily: currentTheme.font,
                    color: currentTheme.colors.accent,
                    textShadow: `4px 4px 0 ${currentTheme.colors.primary}`,
                  }}
                >
                  {countdown}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showFlash && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white z-30 pointer-events-none"
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 w-full max-w-md"
      >
        <div className="mb-2 flex justify-between text-xs" style={{ fontFamily: currentTheme.font }}>
          <span>PROGRESS</span>
          <span>{photos.length} / {config.shotCount}</span>
        </div>
        <div
          className="w-full h-8 border-4 overflow-hidden"
          style={{
            borderColor: currentTheme.colors.border,
            backgroundColor: 'white',
          }}
        >
          <motion.div
            className="h-full"
            initial={{ width: 0 }}
            animate={{ width: `${(photos.length / config.shotCount) * 100}%` }}
            style={{
              backgroundColor: currentTheme.colors.primary,
              imageRendering: 'pixelated',
            }}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex gap-4"
      >
        {photos.length === 0 && (
          <>
            <button
              onClick={onBack}
              className="border-4 px-6 py-3"
              style={{
                borderColor: currentTheme.colors.border,
                backgroundColor: 'white',
                fontFamily: currentTheme.font,
                boxShadow: `4px 4px 0 rgba(0,0,0,0.3)`,
              }}
            >
              BACK
            </button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startCountdown}
              disabled={isCapturing}
              className="border-4 px-8 py-3"
              style={{
                borderColor: currentTheme.colors.border,
                backgroundColor: isCapturing ? '#ccc' : currentTheme.colors.accent,
                fontFamily: currentTheme.font,
                boxShadow: `6px 6px 0 ${currentTheme.colors.primary}`,
              }}
            >
              {isCapturing ? 'CAPTURING...' : 'START'}
            </motion.button>
          </>
        )}
      </motion.div>

      {photos.length === config.shotCount && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-40"
        >
          <div
            className="text-4xl text-center"
            style={{
              fontFamily: currentTheme.font,
              color: currentTheme.colors.accent,
            }}
          >
            COMPLETE!
            <br />
            GENERATING...
          </div>
        </motion.div>
      )}
    </div>
  );
};

const ThemedFrameOverlay: React.FC<{ theme: any }> = ({ theme }) => {
  if (theme.id === 'snoopy') {
    return (
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute top-0 left-0 right-0 h-12 border-b-4 border-black bg-gradient-to-b from-amber-700 to-amber-600 flex items-center justify-between px-4">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-2xl"
          >
            🐦
          </motion.div>
          <div className="text-xs" style={{ fontFamily: theme.font, color: 'white' }}>NATURE</div>
          <motion.div
            animate={{ rotate: [0, 10, 0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl"
          >
            🍂
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-12 border-t-4 border-black bg-gradient-to-t from-amber-700 to-amber-600" />

        <div className="absolute top-12 bottom-12 left-0 w-12 border-r-4 border-black bg-gradient-to-r from-amber-700 to-amber-600" />

        <div className="absolute top-12 bottom-12 right-0 w-12 border-l-4 border-black bg-gradient-to-l from-amber-700 to-amber-600" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <div className="absolute top-0 left-0 right-0 h-12 border-b-4 border-black bg-gradient-to-b from-blue-900 to-blue-700 flex items-center justify-between px-4">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-2xl"
        >
          💧
        </motion.div>
        <div className="text-xs" style={{ fontFamily: theme.font, color: 'gold' }}>FONTAINE</div>
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="text-2xl"
        >
          ✨
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-12 border-t-4 border-black bg-gradient-to-t from-blue-900 to-blue-700" />

      <div className="absolute top-12 bottom-12 left-0 w-12 border-r-4 border-black bg-gradient-to-r from-blue-900 to-blue-700" />

      <div className="absolute top-12 bottom-12 right-0 w-12 border-l-4 border-black bg-gradient-to-l from-blue-900 to-blue-700" />
    </div>
  );
};

const ParticleEffect: React.FC<{ theme: any }> = ({ theme }) => {
  const particles = Array.from({ length: 20 });

  if (theme.id === 'snoopy') {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -20,
              rotate: 0,
            }}
            animate={{
              y: window.innerHeight + 20,
              x: Math.random() * window.innerWidth,
              rotate: 360,
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'linear',
            }}
          >
            🍂
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-xl"
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 20,
            scale: 0.5 + Math.random() * 0.5,
          }}
          animate={{
            y: -20,
            x: Math.random() * window.innerWidth,
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'linear',
          }}
        >
          💧
        </motion.div>
      ))}
    </div>
  );
};
