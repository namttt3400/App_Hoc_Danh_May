/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserStats } from '../types';
import { getUserRank, ACHIEVEMENTS } from '../data/achievements';
import {
  TrendingUp,
  Award,
  Clock,
  Target,
  Flame,
  Zap,
  BarChart3,
  Calendar,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

interface ProgressDashboardProps {
  stats: UserStats;
  onClearHistory?: () => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  stats,
  onClearHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'charts' | 'heatmap' | 'achievements' | 'history'>('charts');
  const [historyFilter, setHistoryFilter] = useState<'all' | 'lesson' | 'speed-test' | 'reflex'>('all');

  const rankInfo = getUserRank(stats.xp);
  const totalMinutes = Math.round(stats.totalPracticeTimeSecs / 60);

  // Compute stats from history
  const testCount = stats.testHistory.length;
  const avgWpm =
    testCount > 0
      ? Math.round(stats.testHistory.reduce((acc, t) => acc + t.wpm, 0) / testCount)
      : 0;
  const bestWpm =
    testCount > 0 ? Math.max(...stats.testHistory.map((t) => t.wpm)) : 0;
  const avgAccuracy =
    testCount > 0
      ? Math.round(stats.testHistory.reduce((acc, t) => acc + t.accuracy, 0) / testCount)
      : 100;

  // Recent 12 test records for chart
  const recentTests = stats.testHistory.slice(-12);

  // Top problem keys
  const sortedProblemKeys = Object.entries(stats.problemKeys)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // SVG Chart Dimensions
  const chartWidth = 650;
  const chartHeight = 200;
  const paddingX = 40;
  const paddingY = 30;

  const maxChartWpm = Math.max(60, ...recentTests.map((t) => t.wpm), bestWpm + 10);
  const minChartWpm = 0;

  const getX = (index: number, total: number) => {
    if (total <= 1) return paddingX + (chartWidth - 2 * paddingX) / 2;
    return paddingX + (index / (total - 1)) * (chartWidth - 2 * paddingX);
  };

  const getY = (val: number) => {
    const range = maxChartWpm - minChartWpm || 1;
    return chartHeight - paddingY - ((val - minChartWpm) / range) * (chartHeight - 2 * paddingY);
  };

  // Build SVG Path for WPM
  const wpmPoints = recentTests.map((t, idx) => ({
    x: getX(idx, recentTests.length),
    y: getY(t.wpm),
    wpm: t.wpm,
    title: t.title,
    date: new Date(t.timestamp).toLocaleDateString('vi-VN', { month: 'numeric', day: 'numeric' }),
  }));

  const wpmPathD = wpmPoints.reduce(
    (acc, pt, idx) => (idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`),
    ''
  );

  const filteredHistory = stats.testHistory.filter((item) => {
    if (historyFilter === 'all') return true;
    return item.mode === historyFilter;
  });

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* User Level & XP Hero Strip */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border-2 border-indigo-500/50 flex flex-col items-center justify-center text-indigo-300 font-extrabold shadow-inner">
            <span className="text-[10px] uppercase tracking-wider text-indigo-400">Cấp độ</span>
            <span className="text-2xl font-typing">{rankInfo.currentRank.level}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{rankInfo.currentRank.title}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {stats.xp} XP
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {rankInfo.nextRank
                ? `Cần thêm ${rankInfo.nextRank.minXp - stats.xp} XP để thăng cấp "${rankInfo.nextRank.title}"`
                : 'Bạn đã đạt cấp bậc cao nhất! Tiếp tục duy trì phong độ nhé!'}
            </p>
            {/* XP Progress Bar */}
            <div className="w-full max-w-xs h-2 rounded-full bg-slate-800 mt-2.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${rankInfo.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center md:text-left">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400">Tốc Độ Tốt Nhất</span>
            <div className="text-xl font-bold text-indigo-400 font-typing tabular-nums mt-0.5">
              {bestWpm} <span className="text-xs font-normal text-slate-500">WPM</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400">Độ Chuẩn Trung Bình</span>
            <div className="text-xl font-bold text-emerald-400 font-typing tabular-nums mt-0.5">
              {avgAccuracy}%
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400">Tổng Thời Gian</span>
            <div className="text-xl font-bold text-amber-400 font-typing tabular-nums mt-0.5">
              {totalMinutes} <span className="text-xs font-normal text-slate-500">phút</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-400">Chuỗi Ngày</span>
            <div className="text-xl font-bold text-rose-400 font-typing tabular-nums mt-0.5 flex items-center justify-center md:justify-start gap-1">
              <Flame className="w-4 h-4 fill-rose-500" />
              <span>{stats.currentStreakDays}</span>
              <span className="text-xs font-normal text-slate-500">ngày</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Selection */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start">
        <button
          onClick={() => setActiveTab('charts')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'charts'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Biểu đồ tiến độ</span>
        </button>

        <button
          onClick={() => setActiveTab('heatmap')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'heatmap'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Phân tích phím sai ({sortedProblemKeys.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'achievements'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Huy hiệu & Thành tích ({stats.unlockedBadges.length}/{ACHIEVEMENTS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'history'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Lịch sử chi tiết ({stats.testHistory.length})</span>
        </button>
      </div>

      {/* TAB CONTENT: CHARTS */}
      {activeTab === 'charts' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                <span>Biểu Đồ Tiến Trình Tốc Độ WPM</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Theo dõi sự gia tăng tốc độ gõ phím theo thời gian và từng bài kiểm tra
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
                <span>Tốc độ WPM</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span>Độ chính xác %</span>
              </div>
            </div>
          </div>

          {recentTests.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-sm">
              Chưa có dữ liệu bài tập nào. Hãy hoàn thành ít nhất 1 bài tập hoặc bài kiểm tra tốc độ để xem biểu đồ!
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <div className="min-w-[500px]">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-56 select-none">
                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const y = paddingY + ratio * (chartHeight - 2 * paddingY);
                    const labelVal = Math.round(maxChartWpm - ratio * (maxChartWpm - minChartWpm));
                    return (
                      <g key={ratio}>
                        <line
                          x1={paddingX}
                          y1={y}
                          x2={chartWidth - paddingX}
                          y2={y}
                          stroke="#1e293b"
                          strokeDasharray="4 4"
                          strokeWidth="1"
                        />
                        <text
                          x={paddingX - 10}
                          y={y + 4}
                          textAnchor="end"
                          fill="#64748b"
                          fontSize="10"
                          fontFamily="monospace"
                        >
                          {labelVal}
                        </text>
                      </g>
                    );
                  })}

                  {/* Area under curve */}
                  {wpmPoints.length > 1 && (
                    <path
                      d={`${wpmPathD} L ${wpmPoints[wpmPoints.length - 1].x} ${chartHeight - paddingY} L ${wpmPoints[0].x} ${chartHeight - paddingY} Z`}
                      fill="url(#wpmGradient)"
                      opacity="0.25"
                    />
                  )}

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="wpmGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* WPM Line */}
                  {wpmPoints.length > 1 && (
                    <path
                      d={wpmPathD}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Accuracy Line */}
                  {recentTests.length > 1 && (
                    <path
                      d={recentTests.reduce((acc, t, idx) => {
                        const x = getX(idx, recentTests.length);
                        // Map accuracy (0-100) to chart bounds
                        const y =
                          chartHeight -
                          paddingY -
                          (t.accuracy / 100) * (chartHeight - 2 * paddingY);
                        return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
                      }, '')}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Data Points */}
                  {wpmPoints.map((pt, idx) => (
                    <g key={idx} className="cursor-pointer group">
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="5"
                        fill="#6366f1"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      {/* Label above point */}
                      <text
                        x={pt.x}
                        y={pt.y - 10}
                        textAnchor="middle"
                        fill="#cbd5e1"
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {pt.wpm}
                      </text>
                      {/* X axis date label */}
                      <text
                        x={pt.x}
                        y={chartHeight - 8}
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="9"
                      >
                        {pt.date}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: HEATMAP & PROBLEM KEYS */}
      {activeTab === 'heatmap' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col gap-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Chẩn Đoán Trí Nhớ Cơ Bắp & Phím Hay Gõ Sai</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Hệ thống theo dõi tự động các phím bạn hay bấm nhầm để đưa ra bài tập khắc phục
            </p>
          </div>

          {sortedProblemKeys.length === 0 ? (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center gap-2">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
              <p className="text-sm font-semibold text-white">Chưa ghi nhận lỗi phím nào!</p>
              <p className="text-xs text-slate-500">Bạn đang gõ rất chuẩn xác. Hãy tiếp tục luyện tập nhé!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedProblemKeys.map(([char, count]) => (
                <div
                  key={char}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-typing text-xl font-bold shrink-0">
                    {char === ' ' ? 'Space' : char}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        Phím "{char === ' ' ? 'Cách' : char}"
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-medium">
                        Sai {count} lần
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {char.toLowerCase() === 'p' || char.toLowerCase() === 'q'
                        ? 'Ngón út cần vươn tự nhiên hơn, tránh xoay cả bàn tay làm mất vị trí cơ sở.'
                        : char.toLowerCase() === 'b' || char.toLowerCase() === 'n'
                        ? 'Ngón trỏ co xuống cần luyện tập thêm để ngón tay ghi nhớ khoảng cách từ phím F và J.'
                        : 'Luyện gõ chậm lại ở ký tự này để xung thần kinh cơ bắp tạo thành phản xạ tự nhiên.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: ACHIEVEMENTS */}
      {activeTab === 'achievements' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col gap-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Kho Huy Hiệu & Phần Thưởng Đạt Được</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Mở khóa các huy hiệu vinh danh khi bạn đạt các mốc tốc độ, độ chuẩn và sự chăm chỉ
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ACHIEVEMENTS.map((ach) => {
              const isUnlocked = stats.unlockedBadges.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isUnlocked
                      ? 'bg-slate-950/80 border-amber-500/40 shadow-lg shadow-amber-500/5'
                      : 'bg-slate-950/40 border-slate-800/80 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{ach.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{ach.title}</h4>
                        {isUnlocked && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                            Đã đạt
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{ach.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: HISTORY */}
      {activeTab === 'history' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>Nhật Ký Luyện Tập Hàng Ngày</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Chi tiết tất cả các lượt gõ phím được lưu trữ an toàn trên trình duyệt của bạn
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setHistoryFilter('all')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  historyFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setHistoryFilter('lesson')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  historyFilter === 'lesson' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Bài học
              </button>
              <button
                onClick={() => setHistoryFilter('speed-test')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  historyFilter === 'speed-test' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Kiểm tra
              </button>
              <button
                onClick={() => setHistoryFilter('reflex')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  historyFilter === 'reflex' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Phản xạ
              </button>
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Chưa có dữ liệu nào trong danh mục này.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="text-[11px] uppercase tracking-wider text-slate-500 bg-slate-950/60 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Thời gian</th>
                    <th className="py-2.5 px-3">Nội dung</th>
                    <th className="py-2.5 px-3 text-right">Tốc độ (WPM)</th>
                    <th className="py-2.5 px-3 text-right">Độ chính xác</th>
                    <th className="py-2.5 px-3 text-right">Thời lượng</th>
                    <th className="py-2.5 px-3 text-right">XP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredHistory
                    .slice()
                    .reverse()
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-3 text-slate-400">
                          {new Date(item.timestamp).toLocaleString('vi-VN', {
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-white max-w-xs truncate">
                          {item.title}
                        </td>
                        <td className="py-2.5 px-3 text-right font-typing font-bold text-indigo-400 tabular-nums">
                          {item.wpm}
                        </td>
                        <td className="py-2.5 px-3 text-right font-typing font-bold text-emerald-400 tabular-nums">
                          {item.accuracy}%
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-400 tabular-nums">
                          {item.durationSeconds}s
                        </td>
                        <td className="py-2.5 px-3 text-right text-amber-400 font-semibold tabular-nums">
                          +{item.xpEarned}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {stats.testHistory.length > 0 && onClearHistory && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={onClearHistory}
                className="text-xs text-rose-400 hover:text-rose-300 underline"
              >
                Xóa lịch sử đã lưu
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
