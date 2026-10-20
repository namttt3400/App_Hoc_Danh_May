/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FingerId, KeyDefinition, TestResultRecord } from '../types';
import { findKeyForChar } from '../utils/keyboardMap';
import { soundManager } from '../utils/audioSynthesis';
import { VirtualKeyboard } from './VirtualKeyboard';
import { HandGuide } from './HandGuide';
import { RotateCcw, Volume2, VolumeX, Eye, EyeOff, Sparkles, Award } from 'lucide-react';

interface TypingArenaProps {
  textToType: string;
  title: string;
  description?: string;
  instructionTip?: string;
  timeLimitSeconds?: number; // Optional countdown mode
  onComplete: (result: TestResultRecord) => void;
  onRestart?: () => void;
  mode?: 'lesson' | 'speed-test' | 'reflex' | 'custom';
}

export const TypingArena: React.FC<TypingArenaProps> = ({
  textToType,
  title,
  description,
  instructionTip,
  timeLimitSeconds,
  onComplete,
  onRestart,
  mode = 'lesson',
}) => {
  // Typing state
  const [typedChars, setTypedChars] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [errorsCount, setErrorsCount] = useState<number>(0);
  const [mistakesByKey, setMistakesByKey] = useState<Record<string, number>>({});
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Key press visuals
  const [pressedCode, setPressedCode] = useState<string | null>(null);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

  // UI display toggles
  const [showKeyboard, setShowKeyboard] = useState<boolean>(true);
  const [showHands, setShowHands] = useState<boolean>(true);
  const [showHandsOverlay, setShowHandsOverlay] = useState<boolean>(true); // Bàn tay mờ ảo trên phím
  const [handsOpacity, setHandsOpacity] = useState<number>(0.6);
  const [soundType, setSoundType] = useState<'blue' | 'brown' | 'bubble' | 'off'>('blue');

  // Text container ref for auto-scrolling
  const textContainerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);

  const currentIndex = typedChars.length;
  const targetChar = currentIndex < textToType.length ? textToType[currentIndex] : '';
  const targetKeyData = targetChar ? findKeyForChar(targetChar) : null;
  const activeFinger: FingerId | null = targetKeyData ? targetKeyData.key.finger : null;

  // Real-time metrics calculation
  const elapsedMinutes = startTime ? Math.max(0.001, (currentTime - startTime) / 60000) : 0.001;
  const totalTyped = typedChars.length;
  const correctCount = typedChars.reduce(
    (acc, char, idx) => (char === textToType[idx] ? acc + 1 : acc),
    0
  );
  const grossWpm = Math.round(totalTyped / 5 / elapsedMinutes);
  const netWpm = Math.max(0, Math.round((totalTyped / 5 - errorsCount) / elapsedMinutes));
  const cpm = Math.round(totalTyped / elapsedMinutes);
  const accuracy = totalTyped > 0 ? Math.max(0, Math.round((correctCount / totalTyped) * 100)) : 100;

  // Time remaining for timed mode
  const timeRemaining = timeLimitSeconds
    ? Math.max(0, timeLimitSeconds - Math.floor((currentTime - (startTime || currentTime)) / 1000))
    : null;

  // Sound switch change
  const handleSoundChange = (type: 'blue' | 'brown' | 'bubble' | 'off') => {
    setSoundType(type);
    soundManager.setSwitchType(type);
    if (type !== 'off') {
      soundManager.playKeyClick(0);
    }
  };

  // Timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !isCompleted) {
      interval = setInterval(() => {
        const now = Date.now();
        setCurrentTime(now);

        // Check time limit
        if (timeLimitSeconds && startTime) {
          const elapsedSecs = (now - startTime) / 1000;
          if (elapsedSecs >= timeLimitSeconds) {
            finishSession(now);
          }
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [startTime, isCompleted, timeLimitSeconds]);

  // Keep target char scrolled into comfortable view
  useEffect(() => {
    if (activeCharRef.current && textContainerRef.current) {
      const container = textContainerRef.current;
      const element = activeCharRef.current;
      const topOffset = element.offsetTop - container.offsetTop;
      if (topOffset > container.clientHeight * 0.6 || topOffset < container.clientHeight * 0.2) {
        container.scrollTo({
          top: Math.max(0, topOffset - container.clientHeight * 0.3),
          behavior: 'smooth',
        });
      }
    }
  }, [currentIndex]);

  const finishSession = useCallback(
    (endTimeNow: number) => {
      if (isCompleted) return;
      setIsCompleted(true);
      soundManager.playSuccessChime();

      const finalElapsedMins = startTime
        ? Math.max(0.01, (endTimeNow - startTime) / 60000)
        : 0.1;
      const finalDurationSecs = Math.round(finalElapsedMins * 60);
      const finalNetWpm = Math.max(0, Math.round((typedChars.length / 5 - errorsCount) / finalElapsedMins));
      const finalCpm = Math.round(typedChars.length / finalElapsedMins);
      const finalAcc =
        typedChars.length > 0 ? Math.round((correctCount / typedChars.length) * 100) : 100;

      // Calculate XP
      const baseXP = Math.round(correctCount * 1.5);
      const accuracyMultiplier = finalAcc >= 98 ? 1.5 : finalAcc >= 95 ? 1.2 : 1.0;
      const wpmBonus = Math.round(finalNetWpm * 2);
      const totalXP = Math.round((baseXP + wpmBonus) * accuracyMultiplier);

      const result: TestResultRecord = {
        id: `res-${Date.now()}`,
        timestamp: Date.now(),
        mode,
        title,
        durationSeconds: finalDurationSecs,
        wpm: grossWpm,
        netWpm: finalNetWpm,
        cpm: finalCpm,
        accuracy: finalAcc,
        totalChars: typedChars.length,
        errorChars: errorsCount,
        xpEarned: totalXP,
        mistakesByKey,
      };

      onComplete(result);
    },
    [isCompleted, startTime, typedChars, errorsCount, correctCount, grossWpm, mistakesByKey, mode, title, onComplete]
  );

  // Keydown handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Prevent scrolling when pressing Space
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
      }

      // Ignore modifier keys alone
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) {
        setPressedCode(e.code);
        setTimeout(() => setPressedCode(null), 150);
        return;
      }

      if (isCompleted) return;

      // Initialize start time on first stroke
      if (!startTime) {
        const now = Date.now();
        setStartTime(now);
        setCurrentTime(now);
      }

      setPressedCode(e.code);

      // Handle Backspace
      if (e.key === 'Backspace') {
        if (typedChars.length > 0) {
          setTypedChars((prev) => prev.slice(0, -1));
          setLastCorrect(null);
          soundManager.playKeyClick(combo);
        }
        setTimeout(() => setPressedCode(null), 120);
        return;
      }

      // Accept single printable characters
      if (e.key.length === 1) {
        const pressedChar = e.key;
        const expectedChar = textToType[currentIndex];
        const isCorrect = pressedChar === expectedChar;

        setLastCorrect(isCorrect);
        setTimeout(() => setPressedCode(null), 120);

        if (isCorrect) {
          const newCombo = combo + 1;
          setCombo(newCombo);
          if (newCombo > maxCombo) setMaxCombo(newCombo);

          soundManager.playKeyClick(newCombo);
          soundManager.playComboStreak(newCombo);
        } else {
          setCombo(0);
          setErrorsCount((prev) => prev + 1);
          setMistakesByKey((prev) => ({
            ...prev,
            [expectedChar]: (prev[expectedChar] || 0) + 1,
          }));
          soundManager.playError();
        }

        const newTyped = [...typedChars, pressedChar];
        setTypedChars(newTyped);

        // Check if finished entire text
        if (newTyped.length >= textToType.length) {
          finishSession(Date.now());
        }
      }
    },
    [isCompleted, startTime, typedChars, currentIndex, textToType, combo, maxCombo, finishSession]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleReset = () => {
    setTypedChars([]);
    setStartTime(null);
    setCurrentTime(0);
    setErrorsCount(0);
    setMistakesByKey({});
    setCombo(0);
    setMaxCombo(0);
    setIsCompleted(false);
    setLastCorrect(null);
    if (onRestart) onRestart();
  };

  return (
    <div className="flex flex-col gap-5 w-full max-w-5xl mx-auto">
      {/* Top Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg md:text-xl font-bold text-white">{title}</h2>
            {timeRemaining !== null && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ⏱️ Còn {timeRemaining}s
              </span>
            )}
          </div>
          {description && <p className="text-xs md:text-sm text-slate-400 mt-0.5">{description}</p>}
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Sound selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => handleSoundChange('blue')}
              title="Switch Blue (Đanh giòn)"
              className={`px-2 py-1 rounded transition-colors ${
                soundType === 'blue' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Blue
            </button>
            <button
              onClick={() => handleSoundChange('brown')}
              title="Switch Brown (Trầm ấm)"
              className={`px-2 py-1 rounded transition-colors ${
                soundType === 'brown' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Brown
            </button>
            <button
              onClick={() => handleSoundChange('bubble')}
              title="Âm Bubble Pop vui nhộn"
              className={`px-2 py-1 rounded transition-colors ${
                soundType === 'bubble' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bubble
            </button>
            <button
              onClick={() => handleSoundChange('off')}
              title="Tắt tiếng"
              className={`p-1 rounded transition-colors ${
                soundType === 'off' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {soundType === 'off' ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Toggle Guides */}
          <button
            onClick={() => setShowHandsOverlay((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              showHandsOverlay
                ? 'bg-indigo-600/30 border-indigo-500/70 text-indigo-300 font-semibold shadow-sm'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title="Bật/Tắt hiệu ứng bàn tay mờ ảo đặt trực tiếp trên bàn phím"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Bàn tay mờ ảo</span>
          </button>

          {showHandsOverlay && (
            <div className="hidden sm:flex items-center gap-1 bg-slate-950 px-1.5 py-1 rounded-lg border border-slate-800 text-[11px]">
              <span className="text-slate-500 mr-0.5">Độ mờ:</span>
              {[
                { label: '35%', val: 0.35 },
                { label: '60%', val: 0.6 },
                { label: '85%', val: 0.85 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => setHandsOpacity(opt.val)}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    handsOpacity === opt.val
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowHands((prev) => !prev)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              showHands
                ? 'bg-slate-800 border-slate-700 text-cyan-300'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title="Bật/Tắt sơ đồ bàn tay phía trên"
          >
            {showHands ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="hidden sm:inline">Sơ đồ tay</span>
          </button>

          <button
            onClick={() => setShowKeyboard((prev) => !prev)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              showKeyboard
                ? 'bg-slate-800 border-slate-700 text-indigo-300'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title="Bật/Tắt bàn phím ảo"
          >
            {showKeyboard ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="hidden sm:inline">Bàn phím</span>
          </button>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Thử lại</span>
          </button>
        </div>
      </div>

      {/* Real-Time Live Performance Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* WPM */}
        <div className="flex flex-col p-3 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Tốc độ WPM</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl md:text-3xl font-extrabold text-indigo-400 font-typing tabular-nums">
              {netWpm}
            </span>
            <span className="text-[11px] text-slate-500">từ/phút</span>
          </div>
        </div>

        {/* Accuracy */}
        <div className="flex flex-col p-3 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Độ chính xác</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className={`text-2xl md:text-3xl font-extrabold font-typing tabular-nums ${
                accuracy >= 95 ? 'text-emerald-400' : accuracy >= 85 ? 'text-amber-400' : 'text-rose-400'
              }`}
            >
              {accuracy}%
            </span>
            <span className="text-[11px] text-slate-500">chuẩn</span>
          </div>
        </div>

        {/* Combo Streak */}
        <div className="flex flex-col p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Chuỗi Combo</span>
            {combo >= 20 && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 animate-bounce">
                x{combo >= 50 ? '5' : combo >= 30 ? '3' : '2'}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl md:text-3xl font-extrabold text-amber-400 font-typing tabular-nums">
              {combo}
            </span>
            <span className="text-[11px] text-slate-500">liên tiếp</span>
          </div>
        </div>

        {/* Progress % */}
        <div className="flex flex-col p-3 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Tiến độ bài</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl md:text-3xl font-extrabold text-cyan-400 font-typing tabular-nums">
              {Math.min(100, Math.round((typedChars.length / textToType.length) * 100))}%
            </span>
            <span className="text-[11px] text-slate-500">
              ({typedChars.length}/{textToType.length})
            </span>
          </div>
        </div>
      </div>

      {/* Instruction Tip */}
      {instructionTip && (
        <div className="flex items-start gap-2.5 px-4 py-2.5 rounded-xl bg-indigo-950/40 border border-indigo-800/50 text-indigo-200 text-xs md:text-sm">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>{instructionTip}</span>
        </div>
      )}

      {/* Main Interactive Typing Prompt Arena */}
      <div
        ref={textContainerRef}
        onClick={() => {
          // Focus indicator for user reassurance
        }}
        className="relative p-6 md:p-8 rounded-2xl bg-slate-900/95 border-2 border-slate-700/80 shadow-2xl overflow-y-auto max-h-48 md:max-h-56 leading-relaxed select-none cursor-text transition-all focus:border-indigo-500"
      >
        <div className="text-lg md:text-2xl font-typing tracking-wide flex flex-wrap gap-y-2">
          {textToType.split('').map((char, index) => {
            const isTyped = index < typedChars.length;
            const isCurrent = index === currentIndex;
            const userChar = isTyped ? typedChars[index] : null;
            const isCorrect = isTyped && userChar === char;

            let charClass = 'text-slate-500';

            if (isTyped) {
              charClass = isCorrect
                ? 'text-emerald-400 font-semibold'
                : 'text-rose-400 underline decoration-rose-500 decoration-2 bg-rose-950/40 font-semibold';
            } else if (isCurrent) {
              charClass = 'text-white bg-indigo-600/60 rounded px-0.5 font-bold ring-2 ring-indigo-400 animate-pulse';
            }

            return (
              <span
                key={`c-${index}`}
                ref={isCurrent ? activeCharRef : null}
                className={`transition-colors duration-75 relative ${charClass}`}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            );
          })}
        </div>

        {/* Start typing prompt banner if user hasn't started */}
        {!startTime && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[1px] rounded-2xl pointer-events-none">
            <span className="px-4 py-2 rounded-lg bg-slate-900/90 border border-slate-700 text-sm font-medium text-slate-300 shadow-lg">
              ⌨️ Gõ phím bất kỳ trên bàn phím để bắt đầu luyện tập...
            </span>
          </div>
        )}
      </div>

      {/* Interactive Hand Guide */}
      {showHands && (
        <div className="w-full">
          <HandGuide activeFinger={activeFinger} targetChar={targetChar} />
        </div>
      )}

      {/* Interactive Virtual Keyboard */}
      {showKeyboard && (
        <div className="w-full">
          <VirtualKeyboard
            targetKey={targetKeyData}
            currentlyPressedCode={pressedCode}
            lastWasCorrect={lastCorrect}
            showHandsOverlay={showHandsOverlay}
            handsOpacity={handsOpacity}
          />
        </div>
      )}
    </div>
  );
};
