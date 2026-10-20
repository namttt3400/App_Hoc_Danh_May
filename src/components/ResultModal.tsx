/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { TestResultRecord } from '../types';
import { getRandomQuote } from '../data/achievements';
import { Trophy, Star, ArrowRight, RotateCcw, CheckCircle, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultModalProps {
  result: TestResultRecord | null;
  onClose: () => void;
  onRetry: () => void;
  onNextLesson?: () => void;
  hasNextLesson?: boolean;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  result,
  onClose,
  onRetry,
  onNextLesson,
  hasNextLesson,
}) => {
  useEffect(() => {
    if (result) {
      // Fire celebratory confetti!
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 },
      });
    }
  }, [result]);

  if (!result) return null;

  // Star rating
  const stars =
    result.accuracy >= 98 && result.wpm >= 30
      ? 3
      : result.accuracy >= 90
      ? 2
      : 1;

  const quote = getRandomQuote();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 md:p-8 flex flex-col items-center text-center">
        {/* Trophy icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 mb-3 -mt-2">
          <Trophy className="w-8 h-8" />
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-white">Hoàn Thành Xuất Sắc!</h3>
        <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-sm">{result.title}</p>

        {/* Stars */}
        <div className="flex items-center gap-1.5 my-3">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={`w-6 h-6 transition-transform ${
                s <= stars ? 'text-amber-400 fill-amber-400 scale-110' : 'text-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Encouraging Quote */}
        <div className="px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs md:text-sm text-slate-300 italic mb-6 w-full">
          "{quote}"
        </div>

        {/* Primary Metrics Strip */}
        <div className="grid grid-cols-3 gap-3 w-full mb-6">
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400">Tốc độ WPM</span>
            <div className="text-2xl font-black text-indigo-400 font-typing tabular-nums mt-0.5">
              {result.wpm}
            </div>
            <span className="text-[10px] text-slate-500">từ/phút</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400">Độ chính xác</span>
            <div
              className={`text-2xl font-black font-typing tabular-nums mt-0.5 ${
                result.accuracy >= 95 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {result.accuracy}%
            </div>
            <span className="text-[10px] text-slate-500">chuẩn mực</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400">Điểm XP</span>
            <div className="text-2xl font-black text-amber-400 font-typing tabular-nums mt-0.5">
              +{result.xpEarned}
            </div>
            <span className="text-[10px] text-slate-500">kinh nghiệm</span>
          </div>
        </div>

        {/* Secondary Detail Row */}
        <div className="flex items-center justify-between w-full text-xs text-slate-400 border-t border-slate-800 pt-3 mb-6 px-1">
          <span>Thời gian: <strong className="text-white">{result.durationSeconds}s</strong></span>
          <span>Số ký tự: <strong className="text-white">{result.totalChars}</strong></span>
          <span>Số lỗi: <strong className={result.errorChars > 0 ? 'text-rose-400' : 'text-emerald-400'}>{result.errorChars}</strong></span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onRetry}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs md:text-sm font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Thử lại</span>
          </button>

          {hasNextLesson && onNextLesson ? (
            <button
              onClick={onNextLesson}
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs md:text-sm font-semibold text-white flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/25"
            >
              <span>Bài tiếp theo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs md:text-sm font-semibold text-white flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/25"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Tiếp tục</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
