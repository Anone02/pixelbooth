import React from 'react';
import { motion } from 'motion/react';
import { ThemeConfig } from '../themes.config';
import furinaImg from "./images/furina.png";
import snoopyImg from "./images/snoopy.png";

interface ThemeCardProps {
  theme: ThemeConfig;
  onClick: () => void;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({ theme, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="cursor-pointer relative"
      style={{
        imageRendering: 'pixelated',
      }}
    >
      <div
        className="border-4 border-black p-8 relative overflow-hidden"
        style={{
          backgroundColor: theme.colors.background,
          boxShadow: '8px 8px 0 rgba(0, 0, 0, 1)',
        }}
      >
        <div className="absolute inset-0 opacity-20">
          {theme.id === 'snoopy' ? (
            <SnoopyBackground />
          ) : (
            <FurinaBackground />
          )}
        </div>

        <div className="relative z-10">
          <h3
            className="text-xl mb-4"
            style={{
              fontFamily: theme.font,
              color: theme.colors.text,
            }}
          >
            {theme.name}
          </h3>

          <div className="flex gap-2 mb-4">
            <div
              className="w-12 h-12 border-2 border-black"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <div
              className="w-12 h-12 border-2 border-black"
              style={{ backgroundColor: theme.colors.secondary }}
            />
            <div
              className="w-12 h-12 border-2 border-black"
              style={{ backgroundColor: theme.colors.accent }}
            />
          </div>

          <div
            className="text-xs mt-4"
            style={{
              fontFamily: theme.font,
              color: theme.colors.text,
            }}
          >
            CLICK TO SELECT
          </div>
        </div>

        {theme.id === 'snoopy' ? (
          <motion.div
            className="absolute bottom-6 right-4"
          >
            <img src={snoopyImg} className="w-35 h-35" />
          </motion.div>
        ) : (
          <motion.div
            className="absolute bottom-6 right-4"
          >
            <img src={furinaImg} className="w-25 h-30" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const SnoopyBackground: React.FC = () => {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hills" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#8B9D83" />
          <path d="M0 20 Q 10 10, 20 20 T 40 20" stroke="#8B6F47" strokeWidth="2" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hills)" />
    </svg>
  );
};

const FurinaBackground: React.FC = () => {
  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="bubbles" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <rect width="60" height="60" fill="#1E3A8A" />
          <circle cx="15" cy="15" r="4" fill="#06B6D4" opacity="0.6" />
          <circle cx="45" cy="35" r="6" fill="#06B6D4" opacity="0.4" />
          <circle cx="30" cy="50" r="3" fill="#FFD700" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bubbles)" />
    </svg>
  );
};
