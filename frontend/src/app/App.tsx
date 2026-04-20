import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeProvider } from './contexts/ThemeContext';
import { Dashboard } from './components/Dashboard';
import { StudioSetup, ShootingConfig } from './components/StudioSetup';
import { ShootingPhase } from './components/ShootingPhase';
import { PhotoResult } from './components/PhotoResult';

type AppState = 'dashboard' | 'setup' | 'shooting' | 'result';

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('dashboard');
  const [selectedTheme, setSelectedTheme] = useState<string>('snoopy');
  const [userName, setUserName] = useState<string>('');
  const [shootingConfig, setShootingConfig] = useState<ShootingConfig>({
    orientation: 'portrait',
    shotCount: 4,
  });
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward');

  const handleStartSetup = (theme: string) => {
    console.log("🔥 THEME MASUK KE APP:", theme);

    setSelectedTheme(theme);
    setTransitionDirection('forward');
    setCurrentState('setup');
  };

  const handleStartShooting = (config: ShootingConfig) => {
    setShootingConfig(config);
    setTransitionDirection('forward');
    setCurrentState('shooting');
  };

  const handlePhotosComplete = async (photos: string[]) => {
    console.log("🧠 FINAL THEME:", selectedTheme);
  setCapturedPhotos(photos);
  setTransitionDirection('forward');
  setCurrentState('result');
  };

  const handleRestart = () => {
    setTransitionDirection('backward');
    setCapturedPhotos([]);
    setCurrentState('dashboard');
  };

  const handleBackToDashboard = () => {
    setTransitionDirection('backward');
    setCurrentState('dashboard');
  };

  const handleBackToSetup = () => {
    setTransitionDirection('backward');
    setCurrentState('setup');
  };

  const variants = {
    enter: (direction: 'forward' | 'backward') => ({
      x: direction === 'forward' ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: 'forward' | 'backward') => ({
      x: direction === 'forward' ? -1000 : 1000,
      opacity: 0,
    }),
  };

  return (
    <ThemeProvider>
      <div className="relative overflow-hidden min-h-screen" style={{ imageRendering: 'pixelated' }}>
        <AnimatePresence mode="wait" custom={transitionDirection}>
          {currentState === 'dashboard' && (
            <motion.div
              key="dashboard"
              custom={transitionDirection}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            >
              <Dashboard
                onStartSetup={handleStartSetup}
                userName={userName}
                setUserName={setUserName}
              />
            </motion.div>
          )}

          {currentState === 'setup' && (
            <motion.div
              key="setup"
              custom={transitionDirection}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            >
              <StudioSetup
                onStartShooting={handleStartShooting}
                onBack={handleBackToDashboard}
              />
            </motion.div>
          )}

          {currentState === 'shooting' && (
            <motion.div
              key="shooting"
              custom={transitionDirection}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            >
              <ShootingPhase
                config={shootingConfig}
                onComplete={handlePhotosComplete}
                onBack={handleBackToSetup}
              />
            </motion.div>
          )}

          {currentState === 'result' && (
            <motion.div
              key="result"
              custom={transitionDirection}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            >
              <PhotoResult
                photos={capturedPhotos}
                config={shootingConfig}
                onRestart={handleRestart}
                userName={userName}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <PixelCursor />
      </div>
    </ThemeProvider>
  );
}

const PixelCursor: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed w-8 h-8 pointer-events-none z-50 hidden md:block"
      animate={{
        x: mousePos.x - 16,
        y: mousePos.y - 16,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
      }}
    >
      <div
        className="w-full h-full border-4 border-black bg-white opacity-50"
        style={{ imageRendering: 'pixelated' }}
      />
    </motion.div>
  );
};