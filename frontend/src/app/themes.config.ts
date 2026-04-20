export interface ThemeConfig {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    border: string;
  };
  font: string;
  particleType: 'leaf' | 'bubble';
  soundEffect: 'paper-rustle' | 'water-drop';
  frameTexture: 'wood' | 'crystal-gold';
  sticker: 'woodstock' | 'hydro-crest';
  decorElements: {
    background: string;
    animated: string[];
  };
}

export const themes: Record<string, ThemeConfig> = {
  snoopy: {
    id: 'snoopy',
    name: 'Snoopy Nature',
    colors: {
      primary: '#8B9D83',
      secondary: '#8B6F47',
      accent: '#F5F5DC',
      background: '#E8F0E3',
      text: '#2C2C2C',
      border: '#000000',
    },
    font: "'Press Start 2P', monospace",
    particleType: 'leaf',
    soundEffect: 'paper-rustle',
    frameTexture: 'wood',
    sticker: 'woodstock',
    decorElements: {
      background: 'hills-parallax',
      animated: ['falling-leaves', 'sleeping-snoopy', 'zzz-particles'],
    },
  },
  furina: {
    id: 'furina',
    name: 'Furina Fontaine',
    colors: {
      primary: '#1E3A8A',
      secondary: '#06B6D4',
      accent: '#FFD700',
      background: '#DBEAFE',
      text: '#1E3A8A',
      border: '#000000',
    },
    font: "'Press Start 2P', monospace",
    particleType: 'bubble',
    soundEffect: 'water-drop',
    frameTexture: 'crystal-gold',
    sticker: 'hydro-crest',
    decorElements: {
      background: 'water-palace',
      animated: ['rising-bubbles', 'furina-sprite', 'sparkle-particles'],
    },
  },
};
