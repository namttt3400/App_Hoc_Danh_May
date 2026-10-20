/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FingerId, KeyDefinition } from '../types';
import { FINGER_DETAILS } from '../utils/keyboardMap';

interface TranslucentHandsOverlayProps {
  targetKey: { key: KeyDefinition; requiresShift: boolean } | null;
  opacity?: number; // 0.1 to 1.0 (default 0.5)
  className?: string;
}

// Approximate coordinate centers for key groups in a 1000 x 360 SVG space
const ROW_Y = [38, 98, 158, 218, 280]; // Row 0 (Nums), Row 1 (Top), Row 2 (Home), Row 3 (Bottom), Row 4 (Space)

// Mapping of fingers to their home positions
const HOME_FINGER_POSITIONS: Record<FingerId, { x: number; y: number }> = {
  'left-pinky': { x: 212, y: ROW_Y[2] },   // A
  'left-ring': { x: 268, y: ROW_Y[2] },    // S
  'left-middle': { x: 324, y: ROW_Y[2] },  // D
  'left-index': { x: 380, y: ROW_Y[2] },   // F
  'left-thumb': { x: 440, y: ROW_Y[4] - 10 }, // Space left
  'right-thumb': { x: 560, y: ROW_Y[4] - 10 }, // Space right
  'right-index': { x: 620, y: ROW_Y[2] },  // J
  'right-middle': { x: 676, y: ROW_Y[2] }, // K
  'right-ring': { x: 732, y: ROW_Y[2] },   // L
  'right-pinky': { x: 788, y: ROW_Y[2] },  // ;
};

// Hand Knuckle Anchors (base of each finger on the palm)
const KNUCKLE_POSITIONS: Record<FingerId, { x: number; y: number }> = {
  'left-pinky': { x: 220, y: 250 },
  'left-ring': { x: 270, y: 242 },
  'left-middle': { x: 322, y: 240 },
  'left-index': { x: 375, y: 245 },
  'left-thumb': { x: 420, y: 285 },
  'right-thumb': { x: 580, y: 285 },
  'right-index': { x: 625, y: 245 },
  'right-middle': { x: 678, y: 240 },
  'right-ring': { x: 730, y: 242 },
  'right-pinky': { x: 780, y: 250 },
};

export const TranslucentHandsOverlay: React.FC<TranslucentHandsOverlayProps> = ({
  targetKey,
  opacity = 0.55,
  className = '',
}) => {
  const activeFinger: FingerId | null = targetKey ? targetKey.key.finger : null;

  // Calculate tip position for each finger
  const getFingerTipPos = (finger: FingerId) => {
    const home = HOME_FINGER_POSITIONS[finger];
    if (activeFinger === finger && targetKey) {
      // Determine target position based on target key row and code
      const row = targetKey.key.row;
      const targetY = ROW_Y[row] ?? home.y;

      // Calculate horizontal target offset relative to row
      let targetX = home.x;
      const code = targetKey.key.code;

      // Fine-tune specific reaching keys
      if (code === 'KeyG') targetX = 425;
      else if (code === 'KeyH') targetX = 575;
      else if (code === 'KeyR') targetX = 355;
      else if (code === 'KeyT') targetX = 410;
      else if (code === 'KeyY') targetX = 590;
      else if (code === 'KeyU') targetX = 645;
      else if (code === 'KeyV') targetX = 390;
      else if (code === 'KeyB') targetX = 435;
      else if (code === 'KeyN') targetX = 565;
      else if (code === 'KeyM') targetX = 620;
      else if (code === 'KeyQ') targetX = 185;
      else if (code === 'KeyW') targetX = 240;
      else if (code === 'KeyE') targetX = 300;
      else if (code === 'KeyI') targetX = 700;
      else if (code === 'KeyO') targetX = 755;
      else if (code === 'KeyP') targetX = 810;
      else if (code === 'KeyZ') targetX = 215;
      else if (code === 'KeyX') targetX = 270;
      else if (code === 'KeyC') targetX = 330;
      else if (code === 'Comma') targetX = 675;
      else if (code === 'Period') targetX = 730;
      else if (code === 'Slash') targetX = 785;
      else if (code === 'Digit1') targetX = 175;
      else if (code === 'Digit2') targetX = 230;
      else if (code === 'Digit3') targetX = 285;
      else if (code === 'Digit4') targetX = 340;
      else if (code === 'Digit5') targetX = 395;
      else if (code === 'Digit6') targetX = 580;
      else if (code === 'Digit7') targetX = 635;
      else if (code === 'Digit8') targetX = 690;
      else if (code === 'Digit9') targetX = 745;
      else if (code === 'Digit0') targetX = 800;

      return { x: targetX, y: targetY };
    }
    return home;
  };

  const fingers: FingerId[] = [
    'left-pinky',
    'left-ring',
    'left-middle',
    'left-index',
    'left-thumb',
    'right-thumb',
    'right-index',
    'right-middle',
    'right-ring',
    'right-pinky',
  ];

  return (
    <div
      className={`absolute inset-0 pointer-events-none select-none overflow-hidden z-20 ${className}`}
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 1000 360"
        preserveAspectRatio="none"
        className="w-full h-full"
        aria-hidden="true"
      >
        <defs>
          {/* Subtle translucent neon gradient for hands */}
          <linearGradient id="leftHandGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="rightHandGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#818cf8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#c7d2fe" stopOpacity="0.1" />
          </linearGradient>

          {/* Active fingertip glow filter */}
          <filter id="fingerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ========================================================= */}
        {/* LEFT PALM SILHOUETTE (BÀN TAY TRÁI MỜ ẢO) */}
        {/* ========================================================= */}
        <g id="left-palm-group">
          {/* Palm base outline */}
          <path
            d="M 180 360 C 185 275, 205 240, 220 250 C 235 245, 360 235, 385 250 C 430 270, 460 320, 430 360 Z"
            fill="url(#leftHandGrad)"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            opacity="0.8"
          />
          {/* Wrist pulse lines */}
          <path d="M 230 320 Q 300 335 380 320" stroke="#38bdf8" strokeWidth="1" fill="none" opacity="0.4" />
          <path d="M 250 280 Q 310 295 360 280" stroke="#38bdf8" strokeWidth="1" fill="none" opacity="0.3" />
        </g>

        {/* ========================================================= */}
        {/* RIGHT PALM SILHOUETTE (BÀN TAY PHẢI MỜ ẢO) */}
        {/* ========================================================= */}
        <g id="right-palm-group">
          {/* Palm base outline */}
          <path
            d="M 570 360 C 540 320, 570 270, 615 250 C 640 235, 765 245, 780 250 C 795 240, 815 275, 820 360 Z"
            fill="url(#rightHandGrad)"
            stroke="#818cf8"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            opacity="0.8"
          />
          {/* Wrist pulse lines */}
          <path d="M 620 320 Q 700 335 770 320" stroke="#818cf8" strokeWidth="1" fill="none" opacity="0.4" />
          <path d="M 640 280 Q 690 295 750 280" stroke="#818cf8" strokeWidth="1" fill="none" opacity="0.3" />
        </g>

        {/* ========================================================= */}
        {/* 10 FINGERS (10 NGÓN TAY VƯƠN TRÊN BÀN PHÍM) */}
        {/* ========================================================= */}
        {fingers.map((finger) => {
          const knuckle = KNUCKLE_POSITIONS[finger];
          const tip = getFingerTipPos(finger);
          const isActive = activeFinger === finger;
          const fingerInfo = FINGER_DETAILS[finger];

          // Compute joint (mid-point curve for realistic finger arc)
          const midX = (knuckle.x + tip.x) / 2 + (finger.includes('thumb') ? (finger.includes('left') ? 15 : -15) : 0);
          const midY = (knuckle.y + tip.y) / 2 - 4;

          return (
            <g key={finger} className="transition-all duration-200">
              {/* Finger Beam / Body connecting knuckle to key tip */}
              <path
                d={`M ${knuckle.x} ${knuckle.y} Q ${midX} ${midY} ${tip.x} ${tip.y}`}
                fill="none"
                stroke={isActive ? fingerInfo.color : '#64748b'}
                strokeWidth={isActive ? '12' : '8'}
                strokeLinecap="round"
                opacity={isActive ? 0.85 : 0.35}
                filter={isActive ? 'url(#fingerGlow)' : undefined}
                className={isActive ? 'transition-all duration-150' : ''}
              />

              {/* Inner core beam for neon feel */}
              <path
                d={`M ${knuckle.x} ${knuckle.y} Q ${midX} ${midY} ${tip.x} ${tip.y}`}
                fill="none"
                stroke={isActive ? '#ffffff' : '#94a3b8'}
                strokeWidth={isActive ? '4' : '2'}
                strokeLinecap="round"
                opacity={isActive ? 0.95 : 0.4}
              />

              {/* Knuckle base dot */}
              <circle
                cx={knuckle.x}
                cy={knuckle.y}
                r={isActive ? 6 : 4}
                fill={isActive ? fingerInfo.color : '#475569'}
                opacity={0.7}
              />

              {/* FINGERTIP PAD OVER KEY */}
              <g transform={`translate(${tip.x}, ${tip.y})`}>
                {/* Active sonar ripple pulse */}
                {isActive && (
                  <>
                    <circle
                      cx="0"
                      cy="0"
                      r="22"
                      fill="none"
                      stroke={fingerInfo.color}
                      strokeWidth="2"
                      opacity="0.8"
                      className="animate-ping"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="16"
                      fill={fingerInfo.color}
                      opacity="0.25"
                    />
                  </>
                )}

                {/* Fingertip Oval Pad */}
                <ellipse
                  cx="0"
                  cy="0"
                  rx={isActive ? 14 : 11}
                  ry={isActive ? 16 : 13}
                  fill={isActive ? fingerInfo.color : '#334155'}
                  stroke={isActive ? '#ffffff' : '#64748b'}
                  strokeWidth={isActive ? 2.5 : 1}
                  opacity={isActive ? 0.95 : 0.6}
                  filter={isActive ? 'url(#fingerGlow)' : undefined}
                />

                {/* Tactile fingertip fingerprint pattern */}
                <ellipse
                  cx="0"
                  cy="0"
                  rx={isActive ? 8 : 6}
                  ry={isActive ? 9 : 7}
                  fill="none"
                  stroke={isActive ? '#ffffff' : '#94a3b8'}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity={isActive ? 0.9 : 0.5}
                />

                {/* Short Finger Label on Tip */}
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={isActive ? '9' : '8'}
                  fontWeight="bold"
                  fontFamily="sans-serif"
                  opacity={isActive ? 1 : 0.75}
                >
                  {finger === 'left-pinky' && 'Út'}
                  {finger === 'left-ring' && 'Áp'}
                  {finger === 'left-middle' && 'Giữa'}
                  {finger === 'left-index' && 'Trỏ'}
                  {finger === 'left-thumb' && 'Cái'}
                  {finger === 'right-thumb' && 'Cái'}
                  {finger === 'right-index' && 'Trỏ'}
                  {finger === 'right-middle' && 'Giữa'}
                  {finger === 'right-ring' && 'Áp'}
                  {finger === 'right-pinky' && 'Út'}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
