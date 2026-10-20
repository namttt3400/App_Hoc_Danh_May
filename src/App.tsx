/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Lesson, SpeedTestPrompt, TestResultRecord, UserStats } from './types';
import { LESSONS } from './data/lessons';
import { SPEED_TEST_PROMPTS } from './data/speedTests';
import { ACHIEVEMENTS, getUserRank } from './data/achievements';
import { TypingArena } from './components/TypingArena';
import { ReflexSprint } from './components/ReflexSprint';
import { ProgressDashboard } from './components/ProgressDashboard';
import { PostureGuideModal } from './components/PostureGuideModal';
import { ResultModal } from './components/ResultModal';
import {
  Keyboard,
  Timer,
  Zap,
  BarChart2,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Flame,
  Award,
  ChevronRight,
  Play,
  RotateCcw,
} from 'lucide-react';

const STORAGE_KEY = 'touchtyping_vn_stats_v1';

const INITIAL_STATS: UserStats = {
  xp: 150,
  level: 1,
  totalPracticeTimeSecs: 0,
  totalCharactersTyped: 0,
  completedLessons: {},
  testHistory: [],
  problemKeys: {},
  unlockedBadges: ['first-step'],
  currentStreakDays: 1,
  lastPracticeDate: new Date().toISOString().split('T')[0],
};

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'lessons' | 'speed-test' | 'reflex' | 'dashboard'>('lessons');

  // Active Lesson or Test state
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(LESSONS[0]);
  const [activeSpeedTest, setActiveSpeedTest] = useState<SpeedTestPrompt | null>(null);
  const [speedTestDuration, setSpeedTestDuration] = useState<number>(60);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [customText, setCustomText] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);

  // Modals
  const [isPostureGuideOpen, setIsPostureGuideOpen] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<TestResultRecord | null>(null);

  // User Stats loaded from LocalStorage
  const [stats, setStats] = useState<UserStats>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...INITIAL_STATS, ...parsed };
        }
      } catch (err) {
        console.error('Error loading stats from localStorage', err);
      }
    }
    return INITIAL_STATS;
  });

  // Save stats to LocalStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (err) {
      console.error('Failed to save stats', err);
    }
  }, [stats]);

  // Daily streak check
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (stats.lastPracticeDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const isConsecutive = stats.lastPracticeDate === yesterday;
      setStats((prev) => ({
        ...prev,
        lastPracticeDate: today,
        currentStreakDays: isConsecutive ? prev.currentStreakDays + 1 : 1,
      }));
    }
  }, [stats.lastPracticeDate]);

  // Handle test or lesson completion
  const handleSessionComplete = (result: TestResultRecord) => {
    setLastResult(result);

    setStats((prev) => {
      const newXp = prev.xp + result.xpEarned;
      const rank = getUserRank(newXp);
      const newTotalSecs = prev.totalPracticeTimeSecs + result.durationSeconds;
      const newTotalChars = prev.totalCharactersTyped + result.totalChars;

      // Update completed lessons record if in lesson mode
      const updatedLessons = { ...prev.completedLessons };
      if (result.mode === 'lesson' && activeLesson) {
        const prevBest = updatedLessons[activeLesson.id];
        updatedLessons[activeLesson.id] = {
          bestWpm: Math.max(prevBest?.bestWpm || 0, result.wpm),
          bestAccuracy: Math.max(prevBest?.bestAccuracy || 0, result.accuracy),
          stars: Math.max(
            prevBest?.stars || 0,
            result.accuracy >= 98 && result.wpm >= 25 ? 3 : result.accuracy >= 90 ? 2 : 1
          ),
          timestamp: Date.now(),
        };
      }

      // Merge problem keys
      const updatedProblemKeys = { ...prev.problemKeys };
      Object.entries(result.mistakesByKey).forEach(([key, count]) => {
        updatedProblemKeys[key] = (updatedProblemKeys[key] || 0) + count;
      });

      // Check achievements to unlock
      const unlocked = [...prev.unlockedBadges];
      if (!unlocked.includes('first-step')) unlocked.push('first-step');
      if (result.wpm >= 25 && !unlocked.includes('speed-novice')) unlocked.push('speed-novice');
      if (result.wpm >= 45 && !unlocked.includes('speed-skilled')) unlocked.push('speed-skilled');
      if (result.wpm >= 65 && !unlocked.includes('speed-master')) unlocked.push('speed-master');
      if (result.accuracy === 100 && !unlocked.includes('perfectionist')) unlocked.push('perfectionist');
      if (newTotalSecs >= 1200 && !unlocked.includes('marathon')) unlocked.push('marathon');

      // Check home master (all 5 lessons of chapter 1)
      const homeLessons = LESSONS.filter((l) => l.category === 'home-row');
      const allHomeDone = homeLessons.every((l) => updatedLessons[l.id]);
      if (allHomeDone && !unlocked.includes('home-master')) unlocked.push('home-master');

      return {
        ...prev,
        xp: newXp,
        level: rank.currentRank.level,
        totalPracticeTimeSecs: newTotalSecs,
        totalCharactersTyped: newTotalChars,
        completedLessons: updatedLessons,
        problemKeys: updatedProblemKeys,
        unlockedBadges: unlocked,
        testHistory: [...prev.testHistory, result],
      };
    });
  };

  const handleNextLesson = () => {
    if (!activeLesson) return;
    const currentIndex = LESSONS.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex >= 0 && currentIndex + 1 < LESSONS.length) {
      setActiveLesson(LESSONS[currentIndex + 1]);
      setLastResult(null);
    } else {
      setLastResult(null);
      setActiveTab('dashboard');
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch sử các lần luyện gõ không?')) {
      setStats((prev) => ({
        ...prev,
        testHistory: [],
        problemKeys: {},
      }));
    }
  };

  const currentLessonIndex = activeLesson ? LESSONS.findIndex((l) => l.id === activeLesson.id) : 0;
  const hasNextLesson = currentLessonIndex >= 0 && currentLessonIndex + 1 < LESSONS.length;

  // Filter speed test prompts
  const filteredSpeedTests = SPEED_TEST_PROMPTS.filter((p) => {
    if (selectedDifficulty === 'all') return true;
    return p.difficulty === selectedDifficulty || p.category.toLowerCase().includes(selectedDifficulty);
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 
        TOP BAR CONTRACT:
        Zone 1: Single text element wordmark
        Zone 2: 4-5 single-line clean navigation links
        Zone 3: 1 primary action
      */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('lessons');
          }}
          className="text-lg md:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <Keyboard className="w-5 h-5" />
          </div>
          <span>Gõ 10 Ngón Chuẩn</span>
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('lessons')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'lessons' ? 'text-indigo-400 font-semibold underline decoration-2 underline-offset-8' : ''
            }`}
          >
            Lộ trình bài học
          </button>
          <button
            onClick={() => {
              setActiveTab('speed-test');
              if (!activeSpeedTest) setActiveSpeedTest(SPEED_TEST_PROMPTS[0]);
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'speed-test' ? 'text-indigo-400 font-semibold underline decoration-2 underline-offset-8' : ''
            }`}
          >
            Kiểm tra tốc độ
          </button>
          <button
            onClick={() => setActiveTab('reflex')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'reflex' ? 'text-indigo-400 font-semibold underline decoration-2 underline-offset-8' : ''
            }`}
          >
            Phản xạ nhanh
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'dashboard' ? 'text-indigo-400 font-semibold underline decoration-2 underline-offset-8' : ''
            }`}
          >
            Biểu đồ tiến độ
          </button>
          <button
            onClick={() => setIsPostureGuideOpen(true)}
            className="transition-colors whitespace-nowrap shrink-0 hover:text-white text-cyan-400 font-medium"
          >
            Tư thế & Gõ tiếng Việt
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span className="font-typing font-bold text-amber-300 tabular-nums">{stats.currentStreakDays}</span>
            <span className="text-slate-400">ngày</span>
          </div>

          <button
            onClick={() => {
              setActiveTab('lessons');
              setActiveLesson(LESSONS[0]);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors whitespace-nowrap shrink-0 shadow-md shadow-indigo-600/20"
          >
            Bắt đầu luyện tập
          </button>
        </div>
      </header>

      {/* Mobile Nav strip */}
      <div className="flex md:hidden items-center justify-around p-2 bg-slate-900 border-b border-slate-800 text-xs font-medium">
        <button
          onClick={() => setActiveTab('lessons')}
          className={`px-2.5 py-1.5 rounded-lg ${
            activeTab === 'lessons' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          Bài học
        </button>
        <button
          onClick={() => {
            setActiveTab('speed-test');
            if (!activeSpeedTest) setActiveSpeedTest(SPEED_TEST_PROMPTS[0]);
          }}
          className={`px-2.5 py-1.5 rounded-lg ${
            activeTab === 'speed-test' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          Kiểm tra WPM
        </button>
        <button
          onClick={() => setActiveTab('reflex')}
          className={`px-2.5 py-1.5 rounded-lg ${
            activeTab === 'reflex' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          Phản xạ
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-2.5 py-1.5 rounded-lg ${
            activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400'
          }`}
        >
          Biểu đồ
        </button>
        <button
          onClick={() => setIsPostureGuideOpen(true)}
          className="px-2.5 py-1.5 rounded-lg text-cyan-400"
        >
          Tư thế
        </button>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-8">
        {/* ========================================================= */}
        {/* TAB 1: CURRICULUM & LESSONS */}
        {/* ========================================================= */}
        {activeTab === 'lessons' && (
          <div className="flex flex-col gap-6">
            {/* If an active lesson is selected, show Typing Arena */}
            {activeLesson ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setActiveLesson(null)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    ← Quay lại danh sách 21 bài học
                  </button>
                  <span className="text-xs text-slate-400">
                    Bài {activeLesson.number} / {LESSONS.length}: {activeLesson.chapter}
                  </span>
                </div>

                <TypingArena
                  key={activeLesson.id}
                  textToType={activeLesson.text}
                  title={`Bài ${activeLesson.number}: ${activeLesson.title}`}
                  description={activeLesson.description}
                  instructionTip={activeLesson.instructionTip}
                  onComplete={handleSessionComplete}
                  onRestart={() => {}}
                  mode="lesson"
                />
              </div>
            ) : (
              /* Lesson Grid View */
              <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                      Lộ Trình Học Đánh Máy 10 Đầu Ngón Tay
                    </h1>
                    <p className="text-xs md:text-sm text-slate-400 mt-1">
                      Phương pháp khoa học từ vị trí ngón trỏ F & J đến 100 từ vựng thông dụng và phản xạ cơ bắp
                    </p>
                  </div>

                  <button
                    onClick={() => setIsPostureGuideOpen(true)}
                    className="self-start md:self-auto px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Xem hướng dẫn tư thế & gờ nổi</span>
                  </button>
                </div>

                {/* Lesson Cards by Chapters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {LESSONS.map((lesson) => {
                    const completed = stats.completedLessons[lesson.id];
                    return (
                      <div
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                          completed
                            ? 'bg-slate-900/90 border-emerald-500/30 hover:border-emerald-500/60 shadow-lg shadow-emerald-500/5'
                            : 'bg-slate-900 border-slate-800 hover:border-indigo-500/60 shadow-md'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-slate-500 font-medium">{lesson.chapter}</span>
                            {completed ? (
                              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Đã hoàn thành</span>
                              </span>
                            ) : (
                              <span className="text-slate-600">Chưa học</span>
                            )}
                          </div>

                          <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                            Bài {lesson.number}: {lesson.title}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                            {lesson.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-slate-500">
                            <span>Phím:</span>
                            <span className="font-typing font-bold text-amber-300">
                              {lesson.targetKeys.slice(0, 5).join(' ')}
                            </span>
                          </div>

                          {completed ? (
                            <span className="font-typing font-bold text-emerald-400">
                              {completed.bestWpm} WPM
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
                              <span>Bắt đầu</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: SPEED TEST */}
        {/* ========================================================= */}
        {activeTab === 'speed-test' && (
          <div className="flex flex-col gap-6">
            {/* Speed Test Configuration Strip */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Timer className="w-5 h-5 text-indigo-400" />
                  <span>Kiểm Tra Tốc Độ Đánh Máy (Timed Speed Test)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Đo lường chính xác chỉ số WPM (Từ mỗi phút), CPM và Độ chuẩn xác theo từng phút
                </p>
              </div>

              {/* Time Selector */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto text-xs">
                {[
                  { label: '1 Phút', secs: 60 },
                  { label: '2 Phút', secs: 120 },
                  { label: '3 Phút', secs: 180 },
                  { label: '5 Phút', secs: 300 },
                ].map((t) => (
                  <button
                    key={t.secs}
                    onClick={() => setSpeedTestDuration(t.secs)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      speedTestDuration === t.secs
                        ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Selector Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 mr-1">Chủ đề:</span>
              {SPEED_TEST_PROMPTS.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => {
                    setIsCustomMode(false);
                    setActiveSpeedTest(prompt);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    !isCustomMode && activeSpeedTest?.id === prompt.id
                      ? 'bg-indigo-600/30 border-indigo-500 text-white font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {prompt.title} ({prompt.category})
                </button>
              ))}

              <button
                onClick={() => setIsCustomMode(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isCustomMode
                    ? 'bg-indigo-600/30 border-indigo-500 text-white font-semibold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                ✏️ Tự nhập văn bản
              </button>
            </div>

            {/* Custom Textarea if Custom Mode */}
            {isCustomMode && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
                <label className="text-xs font-semibold text-slate-300">
                  Dán hoặc nhập đoạn văn bản bạn muốn dùng để kiểm tra tốc độ:
                </label>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Nhập bất kỳ đoạn văn bản tiếng Việt hoặc tiếng Anh nào vào đây..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-typing text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            {/* Speed Test Arena */}
            <TypingArena
              key={`${isCustomMode ? 'custom' : activeSpeedTest?.id}-${speedTestDuration}`}
              textToType={
                isCustomMode
                  ? customText.trim() || 'Hay nhap van ban cua ban de bat dau luyen go toc do.'
                  : activeSpeedTest?.text || SPEED_TEST_PROMPTS[0].text
              }
              title={
                isCustomMode
                  ? 'Kiểm Tra Tốc Độ (Văn Bản Tự Nhập)'
                  : `Bài Kiểm Tra: ${activeSpeedTest?.title || SPEED_TEST_PROMPTS[0].title}`
              }
              description={`Thời lượng giới hạn: ${Math.round(speedTestDuration / 60)} phút`}
              timeLimitSeconds={speedTestDuration}
              onComplete={handleSessionComplete}
              onRestart={() => {}}
              mode="speed-test"
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: REFLEX SPRINT */}
        {/* ========================================================= */}
        {activeTab === 'reflex' && (
          <div className="flex flex-col gap-6">
            <ReflexSprint onComplete={handleSessionComplete} />
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: PROGRESS & ANALYTICS DASHBOARD */}
        {/* ========================================================= */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-6">
            <ProgressDashboard stats={stats} onClearHistory={handleClearHistory} />
          </div>
        )}
      </main>

      {/* Posture & Vietnamese Guide Modal */}
      <PostureGuideModal
        isOpen={isPostureGuideOpen}
        onClose={() => setIsPostureGuideOpen(false)}
      />

      {/* Test / Lesson Result Celebration Modal */}
      <ResultModal
        result={lastResult}
        onClose={() => setLastResult(null)}
        onRetry={() => setLastResult(null)}
        onNextLesson={handleNextLesson}
        hasNextLesson={hasNextLesson && activeTab === 'lessons'}
      />

      {/* Clean quiet footer */}
      <footer className="mt-auto py-6 border-t border-slate-900 bg-slate-950 text-center text-xs text-slate-500">
        <p>Luyện Gõ 10 Ngón Chuẩn · Phương pháp khoa học kích hoạt trí nhớ cơ bắp · Hoạt động ngay trên trình duyệt</p>
      </footer>
    </div>
  );
}
