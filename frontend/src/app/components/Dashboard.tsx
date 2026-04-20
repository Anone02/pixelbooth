import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ThemeCard } from './ThemeCard';
import { themes } from '../themes.config';
import { useTheme } from '../contexts/ThemeContext';

interface DashboardProps {
  onStartSetup: (theme: string) => void;
  userName: string;
  setUserName: (name: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onStartSetup, userName, setUserName }) => {
  const { setTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredThemes = Object.values(themes).filter((theme) =>
    theme.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleThemeSelect = (themeId: string) => {
  console.log("CLICKED THEME:", themeId);

  setTheme(themeId);

  onStartSetup(themeId);
};

  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-gradient-to-b from-purple-200 via-pink-200 to-blue-200">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="mb-12"
      >
        <div
          className="border-4 border-black bg-white p-6 text-center"
          style={{
            boxShadow: '12px 12px 0 rgba(0, 0, 0, 1)',
            imageRendering: 'pixelated',
          }}
        >
          <h1
            className="text-2xl md:text-3xl lg:text-4xl"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              lineHeight: '1.6',
            }}
          >
            WELCOME TO
            <br />
            PHOTO BOOTH!
            <br />
            PICK YOUR THEME.
          </h1>
          <motion.div
            className="mt-4 text-6xl"
            animate={{
              rotate: [0, -10, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            📸
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-2xl mb-8"
      >
        <div className="mb-4">
          <label
            className="block mb-2 text-sm"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            ENTER YOUR NAME:
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="YOUR NAME"
            className="w-full border-4 border-black p-4 text-lg"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              boxShadow: '6px 6px 0 rgba(0, 0, 0, 1)',
              imageRendering: 'pixelated',
            }}
          />
        </div>

        <div>
          <label
            className="block mb-2 text-sm"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            SEARCH THEMES:
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="TYPE HERE..."
            className="w-full border-4 border-black p-4 text-lg"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              boxShadow: '6px 6px 0 rgba(0, 0, 0, 1)',
              imageRendering: 'pixelated',
            }}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl"
      >
        {filteredThemes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            onClick={() => handleThemeSelect(theme.id)}
          />
        ))}
      </motion.div>

      {filteredThemes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-center"
        >
          <p
            className="text-lg"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            NO THEMES FOUND!
          </p>
          <p
            className="text-sm mt-2"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            TRY AGAIN...
          </p>
        </motion.div>
      )}
    </div>
  );
};
