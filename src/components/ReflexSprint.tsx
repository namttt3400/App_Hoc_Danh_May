/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { soundManager } from '../utils/audioSynthesis';
import { TestResultRecord } from '../types';
import { Flame, Zap, Trophy, RotateCcw, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReflexSprintProps {
  onComplete: (result: TestResultRecord) => void;
}

const REFLEX_WORD_BANK = [
  'hoc', 'tap', 'nhanh', 'chuan', 'tay', 'ngon', 'phim', 'may', 'tinh', 'toc',
  'do', 'phan', 'xa', 'co', 'bap', 'tri', 'nho', 'ky', 'nang', 'tien', 'bo',
  'thanh', 'cong', 'kien', 'tri', 'moi', 'ngay', 'sang', 'tao', 'cong', 'nghe',
  'tuong', 'lai', 'vui', 've', 'khoe', 'manh', 'kheo', 'leo', 'ben', 'bi',
  'viet', 'nam', 'the', 'gioi', 'tu', 'tin', 'chinh', 'xac', 'vuon', 'xa',
  'and', 'the', 'that', 'with', 'from', 'they', 'will', 'have', 'more', 'time'
];

export const ReflexSprint: React.FC<ReflexSprintProps> = ({ onComplete }) => {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [inputVal, setInputVal] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [wordsCompleted, setWordsCompleted] = useState<number>(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState<number>(0);
  const [errors, setErrors] = useState<number>(0);

  const inputRef = useRef<HTMLInputElement>(null);

  // Shuffle and set words on mount or restart
  const resetGame = useCallback(() => {
    const shuffled = [...REFLEX_WORD_BANK].sort(() => 0.5 - Math.random());
    setWords(shuffled);
    setCurrentWordIndex(0);
    setInputVal('');
    setTimeLeft(45);
    setIsActive(false);
    setIsDone(false);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setWordsCompleted(0);
    setTotalCharsTyped(0);
    setErrors(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && timeLeft > 0 && !isDone) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, isDone]);

  const endGame = () => {
    setIsDone(true);
    setIsActive(false);
    soundManager.playSuccessChime();

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const durationSecs = 45 - timeLeft;
    const minutes = Math.max(0.1, durationSecs / 60);
    const wpm = Math.round(totalCharsTyped / 5 / minutes);
    const accuracy = totalCharsTyped > 0 ? Math.round(((totalCharsTyped - errors) / totalCharsTyped) * 100) : 100;

    const resultRecord: TestResultRecord = {
      id: `reflex-${Date.now()}`,
      timestamp: Date.now(),
      mode: 'reflex',
      title: 'Thử Thách Phản Xạ Nhanh 45s',
      durationSeconds: durationSecs,
      wpm,
      netWpm: Math.max(0, wpm - errors),
      cpm: Math.round(totalCharsTyped / minutes),
      accuracy,
      totalChars: totalCharsTyped,
      errorChars: errors,
      xpEarned: score,
      mistakesByKey: {},
    };

    onComplete(resultRecord);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!isActive && !isDone) {
      setIsActive(true);
    }

    const currentWord = words[currentWordIndex] || '';

    // Check if word ends with space or matches exactly
    if (val.endsWith(' ') || val === currentWord) {
      const cleanVal = val.trim();
      if (cleanVal === currentWord) {
        // Correct word!
        const newCombo = combo + 1;
        const multiplier = newCombo >= 30 ? 4 : newCombo >= 15 ? 3 : newCombo >= 5 ? 2 : 1;
        const wordPoints = cleanVal.length * 10 * multiplier;

        setCombo(newCombo);
        if (newCombo > maxCombo) setMaxCombo(newCombo);
        setScore((prev) => prev + wordPoints);
        setWordsCompleted((prev) => prev + 1);
        setTotalCharsTyped((prev) => prev + cleanVal.length + 1);

        soundManager.playKeyClick(newCombo);
        soundManager.playComboStreak(newCombo);

        setInputVal('');
        if (currentWordIndex + 1 < words.length) {
          setCurrentWordIndex((prev) => prev + 1);
        } else {
          // Reshuffle additional words
          setWords((prev) => [...prev, ...[...REFLEX_WORD_BANK].sort(() => 0.5 - Math.random())]);
          setCurrentWordIndex((prev) => prev + 1);
        }
      } else {
        // Misspelled word
        setCombo(0);
        setErrors((prev) => prev + 1);
        soundManager.playError();
        setInputVal('');
      }
    } else {
      // Normal typing inside the word
      soundManager.playKeyClick(combo);
      setInputVal(val);
      // Check if current prefix matches
      if (!currentWord.startsWith(val)) {
        soundManager.playError();
      }
    }
  };

  const currentWord = words[currentWordIndex] || '';
  const upcomingWords = words.slice(currentWordIndex + 1, currentWordIndex + 5);

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-6">
      {/* Reflex Header */}
      <div className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Luyện Phản Xạ Nhanh (Speed Sprint)</h3>
            <p className="text-xs text-slate-400">Gõ nhanh từng từ vựng tần suất cao để rèn phản xạ cơ bắp</p>
          </div>
        </div>

        {/* Time Left Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
          <Clock className="w-4 h-4 text-amber-400" />
          <span className="font-typing font-bold text-lg text-white tabular-nums">{timeLeft}s</span>
        </div>
      </div>

      {/* Reflex Stats Strip */}
      <div className="grid grid-cols-3 gap-3 w-full">
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col">
          <span className="text-xs text-slate-400 font-medium">Điểm Phản Xạ (XP)</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-amber-400 font-typing tabular-nums">{score}</span>
            <span className="text-[11px] text-slate-500">pts</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Combo Streak</span>
            {combo >= 5 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                x{combo >= 30 ? '4' : combo >= 15 ? '3' : '2'}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-orange-400 font-typing tabular-nums">{combo}</span>
            <span className="text-[11px] text-slate-500">từ</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col">
          <span className="text-xs text-slate-400 font-medium">Từ Đã Hoàn Thành</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-extrabold text-emerald-400 font-typing tabular-nums">
              {wordsCompleted}
            </span>
            <span className="text-[11px] text-slate-500">từ</span>
          </div>
        </div>
      </div>

      {/* Word Showcase Stage */}
      <div className="w-full p-8 md:p-12 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-indigo-500/40 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Upcoming words peek */}
        <div className="flex items-center gap-3 mb-6 text-sm text-slate-500 select-none">
          <span className="text-xs uppercase tracking-wider text-slate-600 font-medium">Kế tiếp:</span>
          {upcomingWords.map((w, idx) => (
            <span key={idx} className="font-typing opacity-70">
              {w}
            </span>
          ))}
        </div>

        {/* Current Target Word */}
        <div className="relative mb-6">
          <div className="text-4xl md:text-6xl font-black font-typing tracking-widest text-white drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            {currentWord.split('').map((char, idx) => {
              const typedChar = inputVal[idx];
              let color = 'text-slate-300';
              if (typedChar) {
                color = typedChar === char ? 'text-emerald-400' : 'text-rose-400 underline';
              }
              return (
                <span key={idx} className={color}>
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        {/* Interactive Input Field */}
        <div className="w-full max-w-md relative">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={handleInputChange}
            disabled={isDone}
            placeholder={isActive ? 'Gõ từ và bấm phím Cách...' : 'Gõ vào đây để bắt đầu đếm giờ...'}
            autoFocus
            className="w-full text-center py-3.5 px-6 rounded-xl bg-slate-950 border-2 border-indigo-500/70 text-xl font-typing text-white focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/20 shadow-inner"
          />
        </div>

        <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5">
          <span>Mẹo: Gõ xong từ bấm</span>
          <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-typing font-bold">
            Space
          </kbd>
          <span>để chuyển sang từ tiếp theo</span>
        </p>
      </div>

      {/* Restart Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm font-semibold text-white transition-all shadow-md"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Làm lại đợt phản xạ</span>
        </button>
      </div>
    </div>
  );
};
