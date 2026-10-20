/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, CheckCircle } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900/95 border border-amber-500/50 px-4 py-2.5 text-xs font-medium text-slate-200 shadow-2xl backdrop-blur-md animate-bounce">
      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0" />
      <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
      <div>
        <span className="font-semibold text-white">Chế độ Ngoại tuyến (Offline):</span>{' '}
        <span className="text-slate-300">Toàn bộ bài tập và dữ liệu đã sẵn sàng, gõ phím không cần internet!</span>
      </div>
    </div>
  );
};
