/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, CheckCircle2, Info, BookOpen, Sparkles, Monitor, UserCheck } from 'lucide-react';

interface PostureGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostureGuideModal: React.FC<PostureGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [tab, setTab] = useState<'posture' | 'fingers' | 'vietnamese'>('posture');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Cẩm Nang Đánh Máy 10 Ngón Chuẩn</h3>
              <p className="text-xs text-slate-400">Nền tảng quan trọng nhất dành cho người mới bắt đầu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 my-4 text-xs font-semibold">
          <button
            onClick={() => setTab('posture')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              tab === 'posture' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Tư thế ngồi chuẩn
          </button>
          <button
            onClick={() => setTab('fingers')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              tab === 'fingers' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Vị trí 10 đầu ngón tay
          </button>
          <button
            onClick={() => setTab('vietnamese')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              tab === 'vietnamese' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Hướng dẫn gõ tiếng Việt
          </button>
        </div>

        {/* TAB 1: POSTURE */}
        {tab === 'posture' && (
          <div className="flex flex-col gap-4 text-xs md:text-sm text-slate-300">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
              <UserCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block text-sm mb-1">Quy tắc vàng công thái học (Ergonomics):</strong>
                <p className="text-slate-400 leading-relaxed">
                  Ngồi đúng tư thế không chỉ giúp bạn gõ nhanh gấp đôi mà còn bảo vệ cột sống, vai gáy và khớp cổ tay khỏi hội chứng ống cổ tay sau nhiều giờ làm việc.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Lưng thẳng, mắt nhìn ngang</h4>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Mép trên màn hình ngang tầm mắt, cách khoảng 45 - 65 cm. Không cúi gục đầu.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Cánh tay vuông góc 90°</h4>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Khuỷu tay gập góc 90 - 100 độ, hai bả vai thả lỏng tự nhiên, không gồng cứng.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Cổ tay bay lơ lửng nhẹ</h4>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Không tì đè cổ tay nặng nề xuống mép bàn. Giữ cổ tay thẳng hàng với cẳng tay.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white">Bàn chân đặt phẳng</h4>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Hai bàn chân đặt thoải mái trên mặt sàn, đầu gối ngang hoặc thấp hơn hông một chút.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FINGERS & HOME ROW */}
        {tab === 'fingers' && (
          <div className="flex flex-col gap-4 text-xs md:text-sm text-slate-300">
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/60">
              <h4 className="font-bold text-white text-sm mb-1.5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Bí quyết gờ nổi (Tactile Bumps) ở phím F và J:</span>
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Trên mọi bàn phím vi tính chuẩn thế giới, phím <strong className="text-amber-300">F</strong> và{' '}
                <strong className="text-amber-300">J</strong> luôn có một vạch gờ nhỏ nhô lên. Đó là điểm định vị xúc giác giúp bạn nhắm mắt vẫn đặt đúng 10 ngón tay về hàng cơ sở!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <h5 className="font-bold text-cyan-300 mb-2">Bàn Tay Trái (A - S - D - F)</h5>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li><strong className="text-rose-400">Ngón út:</strong> Phím A, Q, Z, Shift trái</li>
                  <li><strong className="text-amber-400">Ngón áp út:</strong> Phím S, W, X</li>
                  <li><strong className="text-emerald-400">Ngón giữa:</strong> Phím D, E, C</li>
                  <li><strong className="text-cyan-400">Ngón trỏ:</strong> Phím F, G, R, T, V, B</li>
                  <li><strong className="text-indigo-400">Ngón cái:</strong> Phím Cách (Space)</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <h5 className="font-bold text-blue-300 mb-2">Bàn Tay Phải (J - K - L - ;)</h5>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  <li><strong className="text-blue-400">Ngón trỏ:</strong> Phím J, H, U, Y, M, N</li>
                  <li><strong className="text-purple-400">Ngón giữa:</strong> Phím K, I, Dấu phẩy (,)</li>
                  <li><strong className="text-pink-400">Ngón áp út:</strong> Phím L, O, Dấu chấm (.)</li>
                  <li><strong className="text-rose-400">Ngón út:</strong> Phím ;, P, Enter, Shift phải</li>
                  <li><strong className="text-indigo-400">Ngón cái:</strong> Phím Cách (Space)</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VIETNAMESE TYPING */}
        {tab === 'vietnamese' && (
          <div className="flex flex-col gap-4 text-xs md:text-sm text-slate-300">
            <p className="text-slate-400">
              Hiện nay ở Việt Nam, kiểu gõ <strong>Telex</strong> là phổ biến nhất trên điện thoại và máy tính, bên cạnh kiểu gõ <strong>VNI</strong>. Dưới đây là bảng đối chiếu nhanh:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <h5 className="font-bold text-white text-sm mb-2 text-indigo-400">Kiểu gõ TELEX (Khuyên dùng)</h5>
                <div className="space-y-1 font-typing text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Dấu Sắc (/)</span>
                    <span className="text-white font-bold">s (ví dụ: as → á)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Dấu Huyền (\)</span>
                    <span className="text-white font-bold">f (ví dụ: af → à)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Dấu Hỏi (?)</span>
                    <span className="text-white font-bold">r (ví dụ: ar → ả)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Dấu Ngã (~)</span>
                    <span className="text-white font-bold">x (ví dụ: ax → ã)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Dấu Nặng (.)</span>
                    <span className="text-white font-bold">j (ví dụ: aj → ạ)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Chữ â, ê, ô, ă, ơ, ư, đ</span>
                    <span className="text-amber-300 font-bold">aa, ee, oo, aw, ow, uw, dd</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <h5 className="font-bold text-white text-sm mb-2 text-cyan-400">Kiểu gõ VNI (Phím số)</h5>
                <div className="space-y-1 font-typing text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Dấu Sắc</span>
                    <span className="text-white font-bold">Phím 1 (a1 → á)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Dấu Huyền</span>
                    <span className="text-white font-bold">Phím 2 (a2 → à)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Dấu Hỏi</span>
                    <span className="text-white font-bold">Phím 3 (a3 → ả)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Dấu Ngã</span>
                    <span className="text-white font-bold">Phím 4 (a4 → ã)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/80">
                    <span className="text-slate-400">Dấu Nặng</span>
                    <span className="text-white font-bold">Phím 5 (a5 → ạ)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Mũ â, ê, ô / Móc ơ, ư / đ</span>
                    <span className="text-cyan-300 font-bold">6 (mũ), 7 (móc), 8 (ă), 9 (đ)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white text-xs transition-colors"
          >
            Đã hiểu, sẵn sàng luyện tập!
          </button>
        </div>
      </div>
    </div>
  );
};
