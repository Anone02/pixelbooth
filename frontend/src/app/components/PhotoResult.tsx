import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { Download, RotateCcw } from 'lucide-react';
import { ShootingConfig } from './StudioSetup';
import snoopyFrame from "./images/snoopyframe.png";
import snoopyFrameL from "./images/snoopyframel.png";
import furinaFrame from "./images/furinaframe.png";
import furinaFrameL from "./images/furinaframel.png";

interface PhotoResultProps {
  photos: string[];
  config: ShootingConfig;
  onRestart: () => void;
  userName: string;
}

export const PhotoResult: React.FC<PhotoResultProps> = ({ photos, config, onRestart, userName }) => {
  const { currentTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [collageUrl, setCollageUrl] = useState<string>('');

  const FRAME_CONFIG = {
    snoopy: {
      portrait: {
        src: snoopyFrame,
        photoArea: { x: 150, y: 235, width: 500, height: 800 },
      },

      landscape: {
        src: snoopyFrameL,
        photoArea: {
          x: 150,
          y: 190,
          width: 900,
          height: 500,
        },
      }

    },
    furina: {
      portrait: {
        src: furinaFrame,
        photoArea: { x: 150, y: 150, width: 500, height: 900 },
      },

      landscape: {
        src: furinaFrameL,
        photoArea: {
          x: 150,
          y: 120,
          width: 900,
          height: 500,
        },
      },
    
    },
  };

  useEffect(() => {
    generateCollage();
  }, [photos, config, currentTheme]);

  const generateCollage = async () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frameWidth = 60;
    const padding = 20;
    const gridGap = 10;

    const baseWidth = config.orientation === 'portrait' ? 800 : 1200;
    const baseHeight = config.orientation === 'portrait' ? 1200 : 800;

    canvas.width = baseWidth;
    canvas.height = baseHeight;

    const frameConfig = FRAME_CONFIG[currentTheme.id]?.[config.orientation];

    let frameImg: HTMLImageElement | null = null;

    if (frameConfig) {
      frameImg = new Image();
      frameImg.src = frameConfig.src;

      await new Promise((resolve) => {
        frameImg!.onload = resolve;
      });
    }

    ctx.fillStyle = currentTheme.colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const getGridLayout = () => {
      if (config.shotCount === 1) return { cols: 1, rows: 1 };
      if (config.shotCount === 2)
        return config.orientation === 'portrait'
          ? { cols: 1, rows: 2 }
          : { cols: 2, rows: 1 };
      if (config.shotCount === 4) return { cols: 2, rows: 2 };
      if (config.shotCount === 6)
        return config.orientation === 'portrait'
          ? { cols: 2, rows: 3 }
          : { cols: 3, rows: 2 };
      return { cols: 2, rows: 2 };
    };

    const { cols, rows } = getGridLayout();

    let startX, startY, contentWidth, contentHeight;

    if (frameConfig) {
      ({ x: startX, y: startY, width: contentWidth, height: contentHeight } =
        frameConfig.photoArea);
    } else {
      startX = frameWidth + padding;
      startY = frameWidth + padding;

      contentWidth = canvas.width - frameWidth * 2 - padding * 2;
      contentHeight = canvas.height - frameWidth * 2 - padding * 2 - 80;
    }

    const photoWidth = (contentWidth - gridGap * (cols - 1)) / cols;
    const photoHeight = (contentHeight - gridGap * (rows - 1)) / rows;

    const loadedImages = await Promise.all(
      photos.map((photo) => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.src = photo;
        });
      })
    );

    loadedImages.forEach((img, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);

      const x = startX + col * (photoWidth + gridGap);
      const y = startY + row * (photoHeight + gridGap);

      ctx.save();
      ctx.strokeStyle = currentTheme.colors.border;
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, photoWidth, photoHeight);

      ctx.fillStyle = 'white';
      ctx.fillRect(x + 2, y + 2, photoWidth - 4, photoHeight - 4);

      const targetRatio = (photoWidth - 8) / (photoHeight - 8);
      const imgRatio = img.width / img.height;

      let sx = 0;
      let sy = 0;
      let sWidth = img.width;
      let sHeight = img.height;

      if (imgRatio > targetRatio) {
        sWidth = img.height * targetRatio;
        sx = (img.width - sWidth) / 2;
      } else {
        sHeight = img.width / targetRatio;
        sy = (img.height - sHeight) / 2;
      }

      ctx.drawImage(
        img,
        sx, sy, sWidth, sHeight,
        x + 4, y + 4, photoWidth - 8, photoHeight - 8
      );
      ctx.restore();
    });

    // 🔥 posisi text (naikin lebih atas & lebih fleksibel)
    const TEXT_OFFSET = 120; // makin besar = makin ke atas

    const bottomY = canvas.height - frameWidth - TEXT_OFFSET;

    //ctx.font = "20px 'Press Start 2P'";
    //ctx.fillStyle = currentTheme.colors.text;
    ctx.textAlign = 'center';
    //ctx.fillText(userName || 'PHOTOBOOTH', canvas.width / 2, bottomY);

    ctx.font = "14px 'Press Start 2P'";
    //ctx.fillText(currentTheme.name.toUpperCase(), canvas.width / 2, bottomY + 30);

    if (frameImg) {
      ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
    }

    const url = canvas.toDataURL('image/png');
    setCollageUrl(url);
    uploadToBackend(url);
  };

  const uploadToBackend = async (image: string) => {
    try {
      
      await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userName || "guest",
          theme: currentTheme.id,
          image: image,
        }),
      });
      console.log("✅ Upload berhasil!");
    } catch (error) {
      console.error("❌ Gagal upload:", error);
    }
  };

  const drawPixelatedFrame = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frameWidth: number,
    theme: any
  ) => {
    const gradient = theme.id === 'snoopy'
      ? ctx.createLinearGradient(0, 0, 0, height)
      : ctx.createLinearGradient(0, 0, 0, height);

    if (theme.id === 'snoopy') {
      gradient.addColorStop(0, theme.colors.secondary);
      gradient.addColorStop(1, '#654321');
    } else {
      gradient.addColorStop(0, theme.colors.primary);
      gradient.addColorStop(1, theme.colors.secondary);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, frameWidth);
    ctx.fillRect(0, height - frameWidth, width, frameWidth);
    ctx.fillRect(0, 0, frameWidth, height);
    ctx.fillRect(width - frameWidth, 0, frameWidth, height);

    ctx.strokeStyle = theme.colors.border;
    ctx.lineWidth = 8;
    ctx.strokeRect(4, 4, width - 8, height - 8);

    if (theme.id === 'snoopy') {
      for (let i = 0; i < 10; i++) {
        const size = 6 + Math.random() * 4;
        ctx.fillStyle = '#8B9D83';
        ctx.fillRect(
          frameWidth / 2 + Math.random() * (width - frameWidth),
          Math.random() * frameWidth,
          size,
          size
        );
      }
    } else {
      for (let i = 0; i < 15; i++) {
        const size = 4 + Math.random() * 6;
        ctx.fillStyle = theme.colors.accent;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(
          Math.random() * width,
          Math.random() * height,
          size,
          size
        );
      }
      ctx.globalAlpha = 1;
    }
  };

  const drawStickers = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    theme: any
  ) => {
    ctx.font = "48px 'Press Start 2P'";

    if (theme.id === 'snoopy') {
      ctx.fillText('🐦', 80, 80);
      ctx.fillText('🐾', width - 120, height - 80);
      ctx.fillText('🍂', width - 120, 80);
    } else {
      ctx.fillText('💧', 80, 80);
      ctx.fillText('✨', width - 120, height - 80);
      ctx.fillText('⚜️', width - 120, 80);
    }
  };

  const handleDownload = () => {
    if (collageUrl) {
      const link = document.createElement('a');
      link.download = `photobooth-${currentTheme.id}-${Date.now()}.png`;
      link.href = collageUrl;
      link.click();
    }
  };

  return (
    <div
      className="min-h-screen p-8 flex flex-col items-center justify-center"
      style={{
        backgroundColor: currentTheme.colors.background,
        imageRendering: 'pixelated',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2
          className="text-2xl text-center"
          style={{
            fontFamily: currentTheme.font,
            color: currentTheme.colors.text,
          }}
        >
          YOUR PHOTOS!
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <canvas
          ref={canvasRef}
          className="border-8 max-w-full h-auto"
          style={{
            borderColor: currentTheme.colors.border,
            boxShadow: `16px 16px 0 ${currentTheme.colors.primary}`,
            imageRendering: 'pixelated',
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="border-4 px-8 py-4 flex items-center gap-3"
          style={{
            borderColor: currentTheme.colors.border,
            backgroundColor: currentTheme.colors.accent,
            fontFamily: currentTheme.font,
            boxShadow: `8px 8px 0 ${currentTheme.colors.primary}`,
          }}
        >
          <Download size={24} />
          DOWNLOAD
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className="border-4 px-8 py-4 flex items-center gap-3"
          style={{
            borderColor: currentTheme.colors.border,
            backgroundColor: currentTheme.colors.secondary,
            color: 'white',
            fontFamily: currentTheme.font,
            boxShadow: `8px 8px 0 ${currentTheme.colors.primary}`,
          }}
        >
          <RotateCcw size={24} />
          NEW SESSION
        </motion.button>
      </motion.div>
    </div>
  );
};
