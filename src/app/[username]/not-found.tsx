import Link from 'next/link';
import { ArrowLeft, UserX, Sparkles } from 'lucide-react';

export default function ProfileNotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#090b10] text-white">
      <div className="ambient-glow w-96 h-96 top-1/4 left-1/2 -translate-x-1/2 bg-blue-600/10" />

      <div className="relative max-w-md w-full text-center rounded-3xl p-8 glass-panel border border-white/10 z-10 shadow-2xl">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
          <UserX className="w-7 h-7" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight mb-2">
          Profile Not Found
        </h2>
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          This digital networking card is either private, unpublished, or has not been claimed yet.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/signup"
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>Claim Your Card on LinkUp</span>
          </Link>

          <Link
            href="/"
            className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
