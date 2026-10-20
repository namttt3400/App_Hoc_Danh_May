/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { KeyDefinition, FingerId } from '../types';
import { KEYBOARD_ROWS, FINGER_DETAILS } from '../utils/keyboardMap';
import { TranslucentHandsOverlay } from './TranslucentHandsOverlay';

interface VirtualKeyboardProps {
  targetKey: { key: KeyDefinition; requiresShift: boolean } | null;
  currentlyPressedCode: string | null;
  lastWasCorrect: boolean | null;
  showFingerColors?: boolean;
  showHandsOverlay?: boolean;
  handsOpacity?: number;
  className?: string;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  targetKey,
  currentlyPressedCode,
  lastWasCorrect,
  showFingerColors = true,
  showHandsOverlay = true,
  handsOpacity = 0.55,
  className = '',
}) => {
  return (
    <div
      className={`relative w-full max-w-4xl mx-auto p-3 md:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md select-none overflow-hidden ${className}`}
    >
      {/* Translucent Phantom Hands Overlay on top of keys */}
      {showHandsOverlay && (
        <TranslucentHandsOverlay
          targetKey={targetKey}
          opacity={handsOpacity}
        />
      )}

      <div className="flex flex-col gap-1.5 md:gap-2 relative z-10">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={`row-${rowIdx}`} className="flex justify-center gap-1 md:gap-1.5 w-full">
            {row.map((key) => {
              const fingerInfo = FINGER_DETAILS[key.finger];
              const isTarget = targetKey?.key.code === key.code;
              const isShiftNeeded = targetKey?.requiresShift;
              
              // If shift is needed, highlight the opposite shift key
              const isShiftActive =
                isShiftNeeded &&
                ((fingerInfo.hand === 'left' && key.code === 'ShiftRight') ||
                  (fingerInfo.hand === 'right' && key.code === 'ShiftLeft'));

              const isPressed = currentlyPressedCode === key.code;

              // Finger color styles
              const colorBorder = showFingerColors ? fingerInfo.borderClass : 'border-slate-700';
              const colorBg = showFingerColors ? fingerInfo.bgClass : 'bg-slate-800/80';
              const colorText = showFingerColors ? fingerInfo.textClass : 'text-slate-200';

              // Key dimensions
              const widthClass = key.width || 'w-8 h-10 md:w-12 md:h-12 flex-1 max-w-[52px]';

              // Dynamic active/target styling
              let keyStateStyle = `${colorBg} ${colorBorder} ${colorText}`;

              if (isPressed) {
                if (lastWasCorrect === true) {
                  keyStateStyle = 'bg-emerald-500 text-white border-emerald-400 scale-95 shadow-[0_0_12px_rgba(16,185,129,0.8)]';
                } else if (lastWasCorrect === false) {
                  keyStateStyle = 'bg-rose-500 text-white border-rose-400 scale-95 shadow-[0_0_12px_rgba(244,63,94,0.8)]';
                } else {
                  keyStateStyle = 'bg-indigo-600 text-white border-indigo-400 scale-95';
                }
              } else if (isTarget) {
                keyStateStyle = `${fingerInfo.activeGlow} animate-target-key ring-2 ring-amber-400/80 font-bold`;
              } else if (isShiftActive) {
                keyStateStyle = 'bg-amber-500/30 border-amber-400 text-amber-200 animate-pulse ring-1 ring-amber-400';
              }

              return (
                <div
                  key={key.code}
                  className={`relative flex flex-col items-center justify-center rounded-lg border text-xs md:text-sm font-typing transition-all duration-100 ${widthClass} ${keyStateStyle}`}
                >
                  {/* Shift label for keys that have symbols */}
                  {key.shiftChar && key.shiftChar !== key.char.toUpperCase() && (
                    <span className="text-[9px] md:text-[10px] opacity-70 leading-none">
                      {key.shiftChar}
                    </span>
                  )}

                  {/* Primary Key Label */}
                  <span className="font-semibold uppercase leading-tight">
                    {key.label || key.char}
                  </span>

                  {/* Tactile bump for Home row anchors F & J */}
                  {key.hasTactileBump && (
                    <span
                      className="absolute bottom-1 w-3 md:w-4 h-0.5 rounded-full bg-amber-400/80"
                      title="Gờ xúc giác định vị ngón trỏ"
                    />
                  )}

                  {/* Home row indicator dot */}
                  {key.isHomeKey && !key.hasTactileBump && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-slate-500/50" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
