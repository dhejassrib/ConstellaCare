import React, { useEffect, useRef, useState } from 'react';

interface ConstellationSphereProps {
  theme: 'light' | 'dark';
}

interface StarNode {
  x: number;
  y: number;
  z: number;
  px: number;
  py: number;
  label: string;
  isSpecial: boolean;
  size: number;
  glowProgress: number;
}

const ComfortWords = [
  'Hope 🌸', 'Acceptance ✨', 'Comfort 🎗️', 'Connection 💞', 'Empathy 💜',
  'Together 🤝', 'Healing 🌱', 'Peace 🕊️', 'Resilience 💪', 'Care 🎀',
  'Warmth ☀️', 'Light 🌟', 'Journey ⛵', 'Strength ⚓', 'Love 💕', 'Grace 🍀'
];

export default function ConstellationSphere({ theme }: ConstellationSphereProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<StarNode[]>([]);
  const rotateRef = useRef({ valX: 0.0008, valY: 0.0012, currentX: 0.0008, currentY: 0.0012 });
  const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0, active: false, closestIndex: -1 });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Initialize stars once
  useEffect(() => {
    const starCount = 55;
    const radius = 250;
    const temp: StarNode[] = [];

    for (let i = 0; i < starCount; i++) {
      // Golden spiral distribution / random spherical coordinate mapping
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = radius * (0.6 + 0.4 * Math.random()); // distribute somewhat inside/outside sphere

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      // Distribute specific soothing phrases on selected stars
      const isWordStar = i < ComfortWords.length;
      const label = isWordStar ? ComfortWords[i] : '';

      temp.push({
        x,
        y,
        z,
        px: 0,
        py: 0,
        label,
        isSpecial: isWordStar,
        size: isWordStar ? 3 : 1 + Math.random() * 1.5,
        glowProgress: Math.random() * Math.PI // start randomized cycle
      });
    }
    starsRef.current = temp;
  }, []);

  // ResizeObserver for container size
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setDimensions({ 
        width: Math.max(width, 300), 
        height: Math.max(height, 300) 
      });
    });

    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Animation and interactivity engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    const focalLength = 320; // 3D Camera depth focal reference

    const draw = () => {
      // Clear with radial overlay glow instead of hard wipe
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;

      // Adjust rotation speed based on mouse position (Parallax Orbit)
      if (mouseRef.current.active) {
        const dx = mouseRef.current.x - centerX;
        const dy = mouseRef.current.y - centerY;
        rotateRef.current.currentX += (dy * 0.000004 - rotateRef.current.currentX) * 0.1;
        rotateRef.current.currentY += (dx * 0.000004 - rotateRef.current.currentY) * 0.1;
      } else {
        // Fallback to slow soothing auto rotation
        rotateRef.current.currentX += (rotateRef.current.valX - rotateRef.current.currentX) * 0.05;
        rotateRef.current.currentY += (rotateRef.current.valY - rotateRef.current.currentY) * 0.05;
      }

      const sinX = Math.sin(rotateRef.current.currentX);
      const cosX = Math.cos(rotateRef.current.currentX);
      const sinY = Math.sin(rotateRef.current.currentY);
      const cosY = Math.cos(rotateRef.current.currentY);

      // Theme Colors mapping
      const isDark = theme === 'dark';
      const lineColor = isDark ? 'rgba(212, 145, 158, 0.07)' : 'rgba(126, 108, 158, 0.08)';
      const specialLineColor = isDark ? 'rgba(244, 212, 168, 0.25)' : 'rgba(212, 121, 142, 0.25)';
      const starNormalColor = isDark ? '#c8c0d8' : '#6E5F80';
      const starGlowColor = isDark ? '#D4919E' : '#D4798E';
      const labelTextColor = isDark ? '#FAF8FD' : '#1A0F2E';
      const connectionDistance = 145;

      // 1. Multiply matrices of stars and track depth
      starsRef.current.forEach((star) => {
        // Rotate Y Axis
        let x1 = star.x * cosY - star.z * sinY;
        let z1 = star.z * cosY + star.x * sinY;

        // Rotate X Axis
        let y2 = star.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + star.y * sinX;

        // Save rotated coordinates
        star.x = x1;
        star.y = y2;
        star.z = z2;

        // Project onto 2D screen view
        const scale = focalLength / (focalLength + z2);
        star.px = centerX + x1 * scale * 1.1;
        star.py = centerY + y2 * scale * 1.1;
        star.glowProgress += 0.015;
      });

      // 2. Identify the closest star to the mouse's pointer
      let closestIdx = -1;
      let minDistance = 50; // trigger hover within 50px radius

      if (mouseRef.current.active) {
        starsRef.current.forEach((star, index) => {
          // Skip if behind camera focal point
          if (star.z < -focalLength) return;
          const dist = Math.hypot(star.px - mouseRef.current.x, star.py - mouseRef.current.y);
          if (dist < minDistance) {
            minDistance = dist;
            closestIdx = index;
          }
        });
      }
      mouseRef.current.closestIndex = closestIdx;

      // 3. Draw Constellation lines (Translucent volumetric webs)
      const starsArr = starsRef.current;
      for (let i = 0; i < starsArr.length; i++) {
        const s1 = starsArr[i];
        if (s1.z < -focalLength) continue;

        for (let j = i + 1; j < starsArr.length; j++) {
          const s2 = starsArr[j];
          if (s2.z < -focalLength) continue;

          // Compute 3D distance between nodes
          const dist3d = Math.hypot(s1.x - s2.x, s1.y - s2.y, s1.z - s2.z);

          if (dist3d < connectionDistance) {
            const isHoveredLine = (i === closestIdx || j === closestIdx);
            
            // Scaled opacity depending on depth and distance
            const scaleAlpha = Math.max(0, 1 - (dist3d / connectionDistance));
            const depthFactor = (focalLength - ((s1.z + s2.z) / 2)) / (focalLength * 2);
            
            ctx.beginPath();
            ctx.moveTo(s1.px, s1.py);
            ctx.lineTo(s2.px, s2.py);
            ctx.shadowBlur = 0;
            
            if (isHoveredLine) {
              ctx.lineWidth = 1.3;
              ctx.strokeStyle = specialLineColor;
            } else {
              ctx.lineWidth = 0.5 * scaleAlpha * depthFactor;
              ctx.strokeStyle = lineColor;
            }
            ctx.stroke();
          }
        }
      }

      // 4. Draw Stars and labels
      starsRef.current.forEach((star, index) => {
        if (star.z < -focalLength) return;

        const isHovered = (index === closestIdx);
        const volumeScale = focalLength / (focalLength + star.z); // scale by depth
        
        // Breathe cycle glow calculation
        const cycleGlow = Math.sin(star.glowProgress) * 0.4 + 0.6;
        const rSize = star.size * volumeScale * (isHovered ? 1.8 : 1);
        
        ctx.beginPath();
        ctx.arc(star.px, star.py, rSize, 0, Math.PI * 2);
        
        if (isHovered || star.isSpecial) {
          ctx.fillStyle = starGlowColor;
          ctx.shadowColor = starGlowColor;
          ctx.shadowBlur = isHovered ? 12 : 6 * cycleGlow;
        } else {
          ctx.fillStyle = starNormalColor;
          ctx.shadowBlur = 0;
        }
        ctx.fill();

        // Highlight ring on hover
        if (isHovered) {
          ctx.beginPath();
          ctx.arc(star.px, star.py, rSize + 6, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${isDark ? '212,145,158' : '126,108,158'}, 0.3)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw Comfort Phrase Label of Special Stars
        if (star.isSpecial && star.label) {
          const fontScale = Math.max(8, Math.floor(10 * volumeScale));
          ctx.font = `${isHovered ? 'bold' : 'normal'} ${fontScale}px font-sans, system-ui`;
          ctx.fillStyle = isHovered ? starGlowColor : starNormalColor;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.shadowBlur = 0;
          
          // Draw standard label slightly below the node
          ctx.fillText(star.label, star.px, star.py + rSize + 6);
        }
      });

      // 5. Draw interactive floating hover box next to pointer if hovered
      if (closestIdx !== -1) {
        const s = starsRef.current[closestIdx];
        if (s.label) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(0,0,0,0.2)';
          ctx.fillStyle = isDark ? 'rgba(18, 13, 33, 0.9)' : 'rgba(255, 255, 255, 0.95)';
          ctx.strokeStyle = isDark ? 'rgba(212, 145, 158, 0.3)' : 'rgba(126, 108, 158, 0.3)';
          ctx.lineWidth = 1;

          const boxWidth = 140;
          const boxHeight = 28;
          const bx = s.px + 12;
          const by = s.py - 14;

          // Draw Rounded Rect Container
          ctx.beginPath();
          ctx.roundRect ? ctx.roundRect(bx, by, boxWidth, boxHeight, 6) : ctx.rect(bx, by, boxWidth, boxHeight);
          ctx.fill();
          ctx.stroke();

          // Render active comforting word inside
          ctx.font = 'bold 11px font-sans, system-ui';
          ctx.fillStyle = labelTextColor;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.shadowBlur = 0;
          ctx.fillText(`✨ Align node: ${s.label.split(' ')[0]}`, bx + 10, by + (boxHeight / 2));
        }
      }

      animFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animFrame);
    };
  }, [dimensions, theme]);

  // Touch and pointer actions
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.active = true;
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  const handlePointerLeave = () => {
    mouseRef.current.active = false;
    mouseRef.current.closestIndex = -1;
  };

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-auto"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="block w-full h-full cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
