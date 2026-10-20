/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Monitor, CheckCircle, X, HelpCircle, Sparkles } from 'lucide-react';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'pill';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [installSuccess, setInstallSuccess] = useState<boolean>(false);

  // If already installed and running standalone
  if (isInstalled) {
    if (variant === 'banner') return null;
    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium ${className}`}>
        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">Đã cài đặt PWA</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const res = await install();
      if (res) {
        setInstallSuccess(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      {variant === 'banner' ? (
        <div className={`p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 border border-indigo-500/40 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${className}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400 shrink-0">
              <Download className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Cài Đặt Ứng Dụng Trên Máy Tính (PWA)</span>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                  Chạy Offline
                </span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Sử dụng như phần mềm máy tính độc lập, mở ngay tức thì và luyện gõ mọi lúc không cần mạng internet.
              </p>
            </div>
          </div>

          <button
            onClick={handleInstallClick}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Cài đặt ngay</span>
          </button>
        </div>
      ) : (
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/50 text-xs font-semibold text-indigo-300 hover:text-white transition-colors whitespace-nowrap shrink-0 ${className}`}
          title="Cài đặt phần mềm để dùng offline trên máy tính"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span>Cài đặt PWA</span>
        </button>
      )}

      {/* Guided Installation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Hướng Dẫn Cài Đặt Ứng Dụng</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                <strong className="text-white block font-semibold mb-1">
                  1. Trên máy tính (Google Chrome, Microsoft Edge, Brave, Cốc Cốc):
                </strong>
                <p className="text-slate-400 leading-relaxed">
                  Nhìn vào <strong>thanh địa chỉ (URL)</strong> ở góc trên bên phải trình duyệt, nhấp vào biểu tượng{' '}
                  <strong className="text-indigo-400">⊕ Cài đặt (Install)</strong> hoặc mở menu dấu 3 chấm → chọn{' '}
                  <strong className="text-white">"Cài đặt Gõ 10 Ngón..."</strong> (hoặc "Install app").
                </p>
              </div>

              {isIOS ? (
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <strong className="text-white block font-semibold mb-1">
                    2. Trên iPhone / iPad (Safari):
                  </strong>
                  <p className="text-slate-400 leading-relaxed">
                    Nhấn vào biểu tượng <strong>Chia sẻ (Share)</strong> ở thanh dưới cùng của Safari → cuộn xuống và chọn{' '}
                    <strong className="text-white">"Thêm vào Màn hình chính" (Add to Home Screen)</strong>.
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <strong className="text-white block font-semibold mb-1">
                    2. Lợi ích khi cài đặt PWA:
                  </strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-400">
                    <li>Hoạt động 100% khi mất mạng (Offline hoàn toàn).</li>
                    <li>Cửa sổ riêng biệt không vướng tab trình duyệt.</li>
                    <li>Tải nhanh tức thì và lưu trữ thành tích an toàn.</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
