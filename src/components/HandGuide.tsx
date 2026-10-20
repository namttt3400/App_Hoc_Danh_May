/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FingerId } from '../types';
import { FINGER_DETAILS } from '../utils/keyboardMap';

interface HandGuideProps {
  activeFinger: FingerId | null;
  targetChar?: string;
  className?: string;
}

export const HandGuide: React.FC<HandGuideProps> = ({
  activeFinger,
  targetChar,
  className = '',
}) => {
  const activeDetails = activeFinger ? FINGER_DETAILS[activeFinger] : null;

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Current Instruction Banner */}
      <div className="mb-3 px-4 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs flex items-center gap-2">
        {activeDetails ? (
          <>
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: activeDetails.color }}
            />
            <span className="text-slate-300">
              Nhấn phím{' '}
              <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-typing font-bold">
                {targetChar === ' ' ? 'Space (Dấu Cách)' : targetChar}
              </kbd>{' '}
              bằng{' '}
              <strong className="text-white font-semibold">{activeDetails.nameVi}</strong>
            </span>
          </>
        ) : (
          <span className="text-slate-400">Đặt 10 ngón tay lên hàng cơ sở (F và J)</span>
        )}
      </div>

      {/* Two Hands SVG Visualizer */}
      <div className="flex items-center justify-center gap-6 md:gap-14 w-full max-w-2xl px-2">
        {/* LEFT HAND */}
        <div className="flex flex-col items-center">
          <div className="text-[11px] font-medium text-slate-400 mb-1">Bàn Tay Trái</div>
          <svg
            viewBox="0 0 200 170"
            className="w-36 h-28 md:w-44 md:h-34 drop-shadow-md"
            aria-label="Minh họa bàn tay trái"
          >
            {/* Palm base */}
            <path
              d="M 50 145 C 50 160, 150 160, 150 145 C 160 100, 155 75, 145 70 C 135 65, 55 65, 45 75 C 40 85, 45 125, 50 145 Z"
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="2"
            />
            {/* Palm creases */}
            <path d="M 60 105 Q 90 120 135 100" stroke="#475569" strokeWidth="1.5" fill="none" />
            <path d="M 70 85 Q 105 105 125 75" stroke="#475569" strokeWidth="1.5" fill="none" />

            {/* Left Pinky */}
            <g className={activeFinger === 'left-pinky' ? 'animate-active-finger' : ''}>
              <rect
                x="32"
                y="50"
                width="16"
                height="45"
                rx="8"
                fill={activeFinger === 'left-pinky' ? '#f43f5e' : '#334155'}
                stroke={activeFinger === 'left-pinky' ? '#fda4af' : '#475569'}
                strokeWidth={activeFinger === 'left-pinky' ? '2.5' : '1.5'}
              />
              <text x="40" y="75" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">Út</text>
            </g>

            {/* Left Ring */}
            <g className={activeFinger === 'left-ring' ? 'animate-active-finger' : ''}>
              <rect
                x="56"
                y="30"
                width="17"
                height="62"
                rx="8.5"
                fill={activeFinger === 'left-ring' ? '#f97316' : '#334155'}
                stroke={activeFinger === 'left-ring' ? '#fed7aa' : '#475569'}
                strokeWidth={activeFinger === 'left-ring' ? '2.5' : '1.5'}
              />
              <text x="64.5" y="65" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">Áp</text>
            </g>

            {/* Left Middle */}
            <g className={activeFinger === 'left-middle' ? 'animate-active-finger' : ''}>
              <rect
                x="82"
                y="18"
                width="18"
                height="74"
                rx="9"
                fill={activeFinger === 'left-middle' ? '#10b981' : '#334155'}
                stroke={activeFinger === 'left-middle' ? '#6ee7b7' : '#475569'}
                strokeWidth={activeFinger === 'left-middle' ? '2.5' : '1.5'}
              />
              <text x="91" y="55" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">Giữa</text>
            </g>

            {/* Left Index */}
            <g className={activeFinger === 'left-index' ? 'animate-active-finger' : ''}>
              <rect
                x="110"
                y="26"
                width="18"
                height="66"
                rx="9"
                fill={activeFinger === 'left-index' ? '#06b6d4' : '#334155'}
                stroke={activeFinger === 'left-index' ? '#67e8f9' : '#475569'}
                strokeWidth={activeFinger === 'left-index' ? '2.5' : '1.5'}
              />
              <text x="119" y="60" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">Trỏ(F)</text>
            </g>

            {/* Left Thumb */}
            <g className={activeFinger === 'left-thumb' ? 'animate-active-finger' : ''}>
              <path
                d="M 140 100 C 155 90, 175 95, 180 110 C 185 125, 160 135, 142 125 Z"
                fill={activeFinger === 'left-thumb' ? '#818cf8' : '#334155'}
                stroke={activeFinger === 'left-thumb' ? '#c7d2fe' : '#475569'}
                strokeWidth={activeFinger === 'left-thumb' ? '2.5' : '1.5'}
              />
              <text x="160" y="115" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">Cái</text>
            </g>
          </svg>
        </div>

        {/* RIGHT HAND */}
        <div className="flex flex-col items-center">
          <div className="text-[11px] font-medium text-slate-400 mb-1">Bàn Tay Phải</div>
          <svg
            viewBox="0 0 200 170"
            className="w-36 h-28 md:w-44 md:h-34 drop-shadow-md"
            aria-label="Minh họa bàn tay phải"
          >
            {/* Palm base */}
            <path
              d="M 50 145 C 50 160, 150 160, 150 145 C 160 125, 155 85, 145 75 C 135 65, 55 65, 45 70 C 40 75, 40 100, 50 145 Z"
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="2"
            />
            {/* Palm creases */}
            <path d="M 65 100 Q 110 120 140 105" stroke="#475569" strokeWidth="1.5" fill="none" />
            <path d="M 75 75 Q 95 105 130 85" stroke="#475569" strokeWidth="1.5" fill="none" />

            {/* Right Thumb */}
            <g className={activeFinger === 'right-thumb' ? 'animate-active-finger' : ''}>
              <path
                d="M 60 125 C 42 135, 17 125, 22 110 C 27 95, 47 90, 62 100 Z"
                fill={activeFinger === 'right-thumb' ? '#818cf8' : '#334155'}
                stroke={activeFinger === 'right-thumb' ? '#c7d2fe' : '#475569'}
                strokeWidth={activeFinger === 'right-thumb' ? '2.5' : '1.5'}
              />
              <text x="40" y="115" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">Cái</text>
            </g>

            {/* Right Index */}
            <g className={activeFinger === 'right-index' ? 'animate-active-finger' : ''}>
              <rect
                x="72"
                y="26"
                width="18"
                height="66"
                rx="9"
                fill={activeFinger === 'right-index' ? '#3b82f6' : '#334155'}
                stroke={activeFinger === 'right-index' ? '#93c5fd' : '#475569'}
                strokeWidth={activeFinger === 'right-index' ? '2.5' : '1.5'}
              />
              <text x="81" y="60" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">Trỏ(J)</text>
            </g>

            {/* Right Middle */}
            <g className={activeFinger === 'right-middle' ? 'animate-active-finger' : ''}>
              <rect
                x="100"
                y="18"
                width="18"
                height="74"
                rx="9"
                fill={activeFinger === 'right-middle' ? '#8b5cf6' : '#334155'}
                stroke={activeFinger === 'right-middle' ? '#c4b5fd' : '#475569'}
                strokeWidth={activeFinger === 'right-middle' ? '2.5' : '1.5'}
              />
              <text x="109" y="55" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">Giữa</text>
            </g>

            {/* Right Ring */}
            <g className={activeFinger === 'right-ring' ? 'animate-active-finger' : ''}>
              <rect
                x="127"
                y="30"
                width="17"
                height="62"
                rx="8.5"
                fill={activeFinger === 'right-ring' ? '#ec4899' : '#334155'}
                stroke={activeFinger === 'right-ring' ? '#fbcfe8' : '#475569'}
                strokeWidth={activeFinger === 'right-ring' ? '2.5' : '1.5'}
              />
              <text x="135.5" y="65" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">Áp</text>
            </g>

            {/* Right Pinky */}
            <g className={activeFinger === 'right-pinky' ? 'animate-active-finger' : ''}>
              <rect
                x="152"
                y="50"
                width="16"
                height="45"
                rx="8"
                fill={activeFinger === 'right-pinky' ? '#e11d48' : '#334155'}
                stroke={activeFinger === 'right-pinky' ? '#fda4af' : '#475569'}
                strokeWidth={activeFinger === 'right-pinky' ? '2.5' : '1.5'}
              />
              <text x="160" y="75" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">Út</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
