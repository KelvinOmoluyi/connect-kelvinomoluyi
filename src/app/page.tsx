import { KelvinCard } from '@/components/KelvinCard';
import { MemphisDecorations } from '@/components/MemphisDecorations';

export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-8 overflow-x-hidden">
      {/* Decorative Memphis Hatching Elements */}
      <MemphisDecorations />

      {/* Main Neo-Brutalist Profile Card */}
      <KelvinCard />
    </main>
  );
}
