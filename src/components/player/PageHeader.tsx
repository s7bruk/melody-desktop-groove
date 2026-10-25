import { useRouter } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function PageHeader({ children }: { children?: ReactNode }) {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4">
      <div className="flex gap-2">
        <button onClick={() => router.history.back()} className="glass rounded-full p-1.5 transition-transform hover:scale-110"><ChevronLeft className="h-5 w-5" /></button>
        <button onClick={() => router.history.forward()} className="glass rounded-full p-1.5 transition-transform hover:scale-110"><ChevronRight className="h-5 w-5" /></button>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
