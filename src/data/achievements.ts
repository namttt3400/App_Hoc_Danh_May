/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    icon: '🌱',
    title: 'Bước Đầu Tiên',
    description: 'Hoàn thành bài tập gõ phím đầu tiên',
    category: 'practice',
    maxProgress: 1,
  },
  {
    id: 'home-master',
    icon: '🏠',
    title: 'Làm Chủ Hàng Cơ Sở',
    description: 'Hoàn thành trọn vẹn 5 bài tập Chương 1 (Home Row)',
    category: 'mastery',
    maxProgress: 5,
  },
  {
    id: 'speed-novice',
    icon: '⚡',
    title: 'Tốc Độ 25 WPM',
    description: 'Đạt tốc độ gõ trên 25 từ mỗi phút',
    category: 'speed',
    maxProgress: 25,
  },
  {
    id: 'speed-skilled',
    icon: '🚀',
    title: 'Tốc Độ 45 WPM',
    description: 'Đạt tốc độ gõ trên 45 từ mỗi phút',
    category: 'speed',
    maxProgress: 45,
  },
  {
    id: 'speed-master',
    icon: '🌪️',
    title: 'Tốc Độ Bão Tố 65+ WPM',
    description: 'Gõ nhanh hơn 65 từ mỗi phút với độ chuẩn cao',
    category: 'speed',
    maxProgress: 65,
  },
  {
    id: 'perfectionist',
    icon: '🎯',
    title: 'Độ Chuẩn Tuyệt Đối',
    description: 'Hoàn thành một bài kiểm tra với độ chính xác 100%',
    category: 'accuracy',
    maxProgress: 100,
  },
  {
    id: 'combo-king',
    icon: '🔥',
    title: 'Chuỗi 50 Phím Hoàn Hảo',
    description: 'Gõ đúng liên tiếp 50 ký tự không phạm một lỗi nào',
    category: 'streak',
    maxProgress: 50,
  },
  {
    id: 'marathon',
    icon: '⏱️',
    title: 'Đôi Bàn Tay Bền Bỉ',
    description: 'Tích lũy tổng cộng 20 phút luyện gõ trên ứng dụng',
    category: 'practice',
    maxProgress: 1200,
  },
  {
    id: 'full-curriculum',
    icon: '👑',
    title: 'Bậc Thầy 10 Ngón',
    description: 'Hoàn thành toàn bộ lộ trình bài học',
    category: 'mastery',
    maxProgress: 21,
  },
];

export const RANKS = [
  { level: 1, title: 'Tập Sự Bàn Phím', minXp: 0, color: 'text-slate-400' },
  { level: 2, title: 'Làm Quen 10 Ngón', minXp: 200, color: 'text-emerald-400' },
  { level: 3, title: 'Ngón Tay Khéo Léo', minXp: 600, color: 'text-cyan-400' },
  { level: 4, title: 'Gõ Phím Chuẩn Xác', minXp: 1200, color: 'text-blue-400' },
  { level: 5, title: 'Tốc Độ Nhanh Nhạy', minXp: 2200, color: 'text-indigo-400' },
  { level: 6, title: 'Bàn Tay Thoăn Thoắt', minXp: 3800, color: 'text-purple-400' },
  { level: 7, title: 'Cao Thủ Phản Xạ', minXp: 6000, color: 'text-pink-400' },
  { level: 8, title: 'Bậc Thầy 10 Đầu Ngón Tay', minXp: 9500, color: 'text-amber-400' },
];

export const ENCOURAGING_QUOTES = [
  'Tuyệt đỉnh! Các tế bào cơ bắp ngón tay đang ghi nhớ vị trí rất tốt!',
  'Bạn đang gõ rất mượt mà! Hãy tiếp tục duy trì nhịp độ ổn định này nhé!',
  'Chuẩn xác 100%! Độ chính xác cao chính là nền tảng để bứt phá tốc độ.',
  'Cứ tự tin lướt phím, đừng sợ gõ sai, mỗi lần thử là một lần tiến bộ vượt bậc!',
  'Bàn tay của bạn đang di chuyển như một nghệ sĩ dương cầm lướt trên phím đàn!',
  'Cảm nhận được gờ nổi F và J dưới ngón trỏ chưa? Đó chính là kim chỉ nam của bạn!',
  'Thần tốc! Tốc độ phản xạ của bạn hôm nay thực sự khiến mọi người ngạc nhiên!',
  'Mỗi ngày chỉ cần 10-15 phút, sau 1 tháng bạn sẽ gõ nhanh gấp 3 lần bình thường!',
];

export function getRandomQuote(): string {
  return ENCOURAGING_QUOTES[Math.floor(Math.random() * ENCOURAGING_QUOTES.length)];
}

export function getUserRank(xp: number) {
  let currentRank = RANKS[0];
  let nextRank = RANKS[1];

  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXp) {
      currentRank = RANKS[i];
      nextRank = RANKS[i + 1] || null;
      break;
    }
  }

  const xpCurrentLevel = currentRank.minXp;
  const xpNextLevel = nextRank ? nextRank.minXp : currentRank.minXp + 2000;
  const progressPercent = Math.min(
    100,
    Math.round(((xp - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) * 100)
  );

  return {
    currentRank,
    nextRank,
    progressPercent,
  };
}
