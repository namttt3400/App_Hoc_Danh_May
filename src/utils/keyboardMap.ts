/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FingerId, KeyDefinition } from '../types';

export const FINGER_DETAILS: Record<
  FingerId,
  {
    nameVi: string;
    hand: 'left' | 'right';
    color: string;
    lightColor: string;
    borderClass: string;
    textClass: string;
    bgClass: string;
    activeGlow: string;
  }
> = {
  'left-pinky': {
    nameVi: 'Ngón út trái',
    hand: 'left',
    color: '#f43f5e',
    lightColor: 'rgba(244, 63, 94, 0.25)',
    borderClass: 'border-rose-500/50',
    textClass: 'text-rose-400',
    bgClass: 'bg-rose-500/15',
    activeGlow: 'shadow-[0_0_16px_rgba(244,63,94,0.8)] border-rose-400 bg-rose-500/40 text-white',
  },
  'left-ring': {
    nameVi: 'Ngón áp út trái',
    hand: 'left',
    color: '#f97316',
    lightColor: 'rgba(249, 115, 22, 0.25)',
    borderClass: 'border-amber-500/50',
    textClass: 'text-amber-400',
    bgClass: 'bg-amber-500/15',
    activeGlow: 'shadow-[0_0_16px_rgba(249,115,22,0.8)] border-amber-400 bg-amber-500/40 text-white',
  },
  'left-middle': {
    nameVi: 'Ngón giữa trái',
    hand: 'left',
    color: '#10b981',
    lightColor: 'rgba(16, 185, 129, 0.25)',
    borderClass: 'border-emerald-500/50',
    textClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500/15',
    activeGlow: 'shadow-[0_0_16px_rgba(16,185,129,0.8)] border-emerald-400 bg-emerald-500/40 text-white',
  },
  'left-index': {
    nameVi: 'Ngón trỏ trái',
    hand: 'left',
    color: '#06b6d4',
    lightColor: 'rgba(6, 182, 212, 0.25)',
    borderClass: 'border-cyan-500/50',
    textClass: 'text-cyan-400',
    bgClass: 'bg-cyan-500/15',
    activeGlow: 'shadow-[0_0_16px_rgba(6,182,212,0.8)] border-cyan-400 bg-cyan-500/40 text-white',
  },
  'left-thumb': {
    nameVi: 'Ngón cái (Phím Cách)',
    hand: 'left',
    color: '#818cf8',
    lightColor: 'rgba(129, 140, 248, 0.25)',
    borderClass: 'border-indigo-500/50',
    textClass: 'text-indigo-400',
    bgClass: 'bg-indigo-500/15',
    activeGlow: 'shadow-[0_0_16px_rgba(129,140,248,0.8)] border-indigo-400 bg-indigo-500/40 text-white',
  },
  'right-thumb': {
    nameVi: 'Ngón cái (Phím Cách)',
    hand: 'right',
    color: '#818cf8',
    lightColor: 'rgba(129, 140, 248, 0.25)',
    borderClass: 'border-indigo-500/50',
    textClass: 'text-indigo-400',
    bgClass: 'bg-indigo-500/15',
    activeGlow: 'shadow-[0_0_16px_rgba(129,140,248,0.8)] border-indigo-400 bg-indigo-500/40 text-white',
  },
  'right-index': {
    nameVi: 'Ngón trỏ phải',
    hand: 'right',
    color: '#3b82f6',
    lightColor: 'rgba(59, 130, 246, 0.25)',
    borderClass: 'border-blue-500/50',
    textClass: 'text-blue-400',
    bgClass: 'bg-blue-500/15',
    activeGlow: 'shadow-[0_0_16px_rgba(59,130,246,0.8)] border-blue-400 bg-blue-500/40 text-white',
  },
  'right-middle': {
    nameVi: 'Ngón giữa phải',
    hand: 'right',
    color: '#8b5cf6',
    lightColor: 'rgba(139, 92, 246, 0.25)',
    borderClass: 'border-purple-500/50',
    textClass: 'text-purple-400',
    bgClass: 'bg-purple-500/15',
    activeGlow: 'shadow-[0_0_16px_rgba(139,92,246,0.8)] border-purple-400 bg-purple-500/40 text-white',
  },
  'right-ring': {
    nameVi: 'Ngón áp út phải',
    hand: 'right',
    color: '#ec4899',
    lightColor: 'rgba(236, 72, 153, 0.25)',
    borderClass: 'border-pink-500/50',
    textClass: 'text-pink-400',
    bgClass: 'bg-pink-500/15',
    activeGlow: 'shadow-[0_0_16px_rgba(236,72,153,0.8)] border-pink-400 bg-pink-500/40 text-white',
  },
  'right-pinky': {
    nameVi: 'Ngón út phải',
    hand: 'right',
    color: '#e11d48',
    lightColor: 'rgba(225, 29, 72, 0.25)',
    borderClass: 'border-rose-500/50',
    textClass: 'text-rose-400',
    bgClass: 'bg-rose-500/15',
    activeGlow: 'shadow-[0_0_16px_rgba(225,29,72,0.8)] border-rose-400 bg-rose-500/40 text-white',
  },
};

export const KEYBOARD_ROWS: KeyDefinition[][] = [
  // Row 0: Number Row
  [
    { code: 'Backquote', char: '`', shiftChar: '~', finger: 'left-pinky', row: 0 },
    { code: 'Digit1', char: '1', shiftChar: '!', finger: 'left-pinky', row: 0 },
    { code: 'Digit2', char: '2', shiftChar: '@', finger: 'left-ring', row: 0 },
    { code: 'Digit3', char: '3', shiftChar: '#', finger: 'left-middle', row: 0 },
    { code: 'Digit4', char: '4', shiftChar: '$', finger: 'left-index', row: 0 },
    { code: 'Digit5', char: '5', shiftChar: '%', finger: 'left-index', row: 0 },
    { code: 'Digit6', char: '6', shiftChar: '^', finger: 'right-index', row: 0 },
    { code: 'Digit7', char: '7', shiftChar: '&', finger: 'right-index', row: 0 },
    { code: 'Digit8', char: '8', shiftChar: '*', finger: 'right-middle', row: 0 },
    { code: 'Digit9', char: '9', shiftChar: '(', finger: 'right-ring', row: 0 },
    { code: 'Digit0', char: '0', shiftChar: ')', finger: 'right-pinky', row: 0 },
    { code: 'Minus', char: '-', shiftChar: '_', finger: 'right-pinky', row: 0 },
    { code: 'Equal', char: '=', shiftChar: '+', finger: 'right-pinky', row: 0 },
    { code: 'Backspace', char: 'Backspace', finger: 'right-pinky', row: 0, width: 'w-16 md:w-20', label: '⌫' },
  ],
  // Row 1: Top Row
  [
    { code: 'Tab', char: 'Tab', finger: 'left-pinky', row: 1, width: 'w-14 md:w-16', label: 'Tab' },
    { code: 'KeyQ', char: 'q', shiftChar: 'Q', finger: 'left-pinky', row: 1 },
    { code: 'KeyW', char: 'w', shiftChar: 'W', finger: 'left-ring', row: 1 },
    { code: 'KeyE', char: 'e', shiftChar: 'E', finger: 'left-middle', row: 1 },
    { code: 'KeyR', char: 'r', shiftChar: 'R', finger: 'left-index', row: 1 },
    { code: 'KeyT', char: 't', shiftChar: 'T', finger: 'left-index', row: 1 },
    { code: 'KeyY', char: 'y', shiftChar: 'Y', finger: 'right-index', row: 1 },
    { code: 'KeyU', char: 'u', shiftChar: 'U', finger: 'right-index', row: 1 },
    { code: 'KeyI', char: 'i', shiftChar: 'I', finger: 'right-middle', row: 1 },
    { code: 'KeyO', char: 'o', shiftChar: 'O', finger: 'right-ring', row: 1 },
    { code: 'KeyP', char: 'p', shiftChar: 'P', finger: 'right-pinky', row: 1 },
    { code: 'BracketLeft', char: '[', shiftChar: '{', finger: 'right-pinky', row: 1 },
    { code: 'BracketRight', char: ']', shiftChar: '}', finger: 'right-pinky', row: 1 },
    { code: 'Backslash', char: '\\', shiftChar: '|', finger: 'right-pinky', row: 1, width: 'w-12 md:w-14' },
  ],
  // Row 2: Home Row
  [
    { code: 'CapsLock', char: 'Caps', finger: 'left-pinky', row: 2, width: 'w-16 md:w-18', label: 'Caps' },
    { code: 'KeyA', char: 'a', shiftChar: 'A', finger: 'left-pinky', row: 2, isHomeKey: true },
    { code: 'KeyS', char: 's', shiftChar: 'S', finger: 'left-ring', row: 2, isHomeKey: true },
    { code: 'KeyD', char: 'd', shiftChar: 'D', finger: 'left-middle', row: 2, isHomeKey: true },
    { code: 'KeyF', char: 'f', shiftChar: 'F', finger: 'left-index', row: 2, isHomeKey: true, hasTactileBump: true },
    { code: 'KeyG', char: 'g', shiftChar: 'G', finger: 'left-index', row: 2 },
    { code: 'KeyH', char: 'h', shiftChar: 'H', finger: 'right-index', row: 2 },
    { code: 'KeyJ', char: 'j', shiftChar: 'J', finger: 'right-index', row: 2, isHomeKey: true, hasTactileBump: true },
    { code: 'KeyK', char: 'k', shiftChar: 'K', finger: 'right-middle', row: 2, isHomeKey: true },
    { code: 'KeyL', char: 'l', shiftChar: 'L', finger: 'right-ring', row: 2, isHomeKey: true },
    { code: 'Semicolon', char: ';', shiftChar: ':', finger: 'right-pinky', row: 2, isHomeKey: true },
    { code: 'Quote', char: "'", shiftChar: '"', finger: 'right-pinky', row: 2 },
    { code: 'Enter', char: 'Enter', finger: 'right-pinky', row: 2, width: 'w-18 md:w-22', label: 'Enter ↵' },
  ],
  // Row 3: Bottom Row
  [
    { code: 'ShiftLeft', char: 'Shift', finger: 'left-pinky', row: 3, width: 'w-20 md:w-24', label: '⇧ Shift' },
    { code: 'KeyZ', char: 'z', shiftChar: 'Z', finger: 'left-pinky', row: 3 },
    { code: 'KeyX', char: 'x', shiftChar: 'X', finger: 'left-ring', row: 3 },
    { code: 'KeyC', char: 'c', shiftChar: 'C', finger: 'left-middle', row: 3 },
    { code: 'KeyV', char: 'v', shiftChar: 'V', finger: 'left-index', row: 3 },
    { code: 'KeyB', char: 'b', shiftChar: 'B', finger: 'left-index', row: 3 },
    { code: 'KeyN', char: 'n', shiftChar: 'N', finger: 'right-index', row: 3 },
    { code: 'KeyM', char: 'm', shiftChar: 'M', finger: 'right-index', row: 3 },
    { code: 'Comma', char: ',', shiftChar: '<', finger: 'right-middle', row: 3 },
    { code: 'Period', char: '.', shiftChar: '>', finger: 'right-ring', row: 3 },
    { code: 'Slash', char: '/', shiftChar: '?', finger: 'right-pinky', row: 3 },
    { code: 'ShiftRight', char: 'Shift', finger: 'right-pinky', row: 3, width: 'w-20 md:w-24', label: '⇧ Shift' },
  ],
  // Row 4: Space Row
  [
    { code: 'Space', char: ' ', finger: 'right-thumb', row: 4, width: 'flex-1 max-w-lg', label: 'Space (Phím Cách)' },
  ],
];

// Helper to look up key info by character
export function findKeyForChar(char: string): { key: KeyDefinition; requiresShift: boolean } | null {
  if (char === ' ') {
    const spaceKey = KEYBOARD_ROWS[4][0];
    return { key: spaceKey, requiresShift: false };
  }

  for (const row of KEYBOARD_ROWS) {
    for (const key of row) {
      if (key.char === char) {
        return { key, requiresShift: false };
      }
      if (key.shiftChar && key.shiftChar === char) {
        return { key, requiresShift: true };
      }
      // Case insensitive match for regular letters
      if (key.char.toLowerCase() === char.toLowerCase()) {
        const isUpper = char === char.toUpperCase() && char !== char.toLowerCase();
        return { key, requiresShift: isUpper };
      }
    }
  }

  return null;
}
