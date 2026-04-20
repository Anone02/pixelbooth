import { useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const useSoundEffect = () => {
  const { currentTheme } = useTheme();

  const playSound = useCallback((soundType: 'capture' | 'countdown' | 'transition' | 'complete') => {
    if (currentTheme.id === 'snoopy') {
      switch (soundType) {
        case 'capture':
          console.log('🔊 [Snoopy Theme] Paper rustle sound');
          break;
        case 'countdown':
          console.log('🔊 [Snoopy Theme] Beep sound');
          break;
        case 'transition':
          console.log('🔊 [Snoopy Theme] Whoosh sound');
          break;
        case 'complete':
          console.log('🔊 [Snoopy Theme] Success jingle');
          break;
      }
    } else if (currentTheme.id === 'furina') {
      switch (soundType) {
        case 'capture':
          console.log('🔊 [Furina Theme] Water drop sound');
          break;
        case 'countdown':
          console.log('🔊 [Furina Theme] Crystal ting');
          break;
        case 'transition':
          console.log('🔊 [Furina Theme] Water splash');
          break;
        case 'complete':
          console.log('🔊 [Furina Theme] Sparkle chime');
          break;
      }
    }

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      let frequency = 440;
      let duration = 0.1;

      if (currentTheme.id === 'snoopy') {
        switch (soundType) {
          case 'capture':
            frequency = 200;
            duration = 0.15;
            break;
          case 'countdown':
            frequency = 600;
            duration = 0.1;
            break;
          case 'complete':
            frequency = 800;
            duration = 0.3;
            break;
        }
      } else {
        switch (soundType) {
          case 'capture':
            frequency = 1200;
            duration = 0.1;
            break;
          case 'countdown':
            frequency = 900;
            duration = 0.08;
            break;
          case 'complete':
            frequency = 1400;
            duration = 0.4;
            break;
        }
      }

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'square';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.log('Audio context not available');
    }
  }, [currentTheme]);

  return { playSound };
};
