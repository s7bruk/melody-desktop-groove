import { Heart, Pause, Play } from "lucide-react";
import { albumOf, fmt, type Track } from "@/lib/music-data";
import { usePlayer } from "./PlayerContext";

export function Slider({ value, max, onChange }: { value: number; max: number; onChange: (v: number) => void }) {
  const pct = (value / max) * 100;
  return (
    <input
      type="range" min={0} max={max} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="range-track w-full"
      style={{ background: `linear-gradient(to right, var(--primary) ${pct}%, var(--accent) ${pct}%)` }}
    />
  );
}

export function Equalizer({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex h-3.5 items-end gap-[2px] ${className}`}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="eq-bar w-[3px] rounded-full bg-primary" style={{ animationDelay: `${i * -0.2}s` }} />
      ))}
    </span>
  );
}

export function TrackList({ list, showCover = true }: { list: Track[]; showCover?: boolean }) {
  const p = usePlayer();
  return (
    <div>
      {list.map((t, i) => {
        const a = albumOf(t);
        const active = t.id === p.track.id;
        return (
          <div
            key={t.id}
            onDoubleClick={() => p.playTrack(t, list)}
            className="animate-fade-up group grid grid-cols-[2rem_1fr_1fr_3rem_4rem] items-center gap-4 rounded-md px-4 py-2 transition-colors hover:bg-surface-hover"
            style={{ animationDelay: `${i * 35}ms` }}
          >
            <button onClick={() => p.playTrack(t, list)} className={`text-sm ${active ? "text-primary" : "text-muted-foreground"}`}>
              <span className="group-hover:hidden">{active && p.playing ? <Equalizer /> : i + 1}</span>
              <span className="hidden text-foreground group-hover:inline">
                {active && p.playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
              </span>
            </button>
            <div className="flex min-w-0 items-center gap-3">
              {showCover && <img src={a.cover} alt="" className="h-10 w-10 rounded object-cover" loading="lazy" />}
              <div className="min-w-0">
                <div className={`truncate text-sm font-semibold ${active ? "text-primary" : ""}`}>{t.title}</div>
                <div className="truncate text-xs text-muted-foreground">{a.artist}</div>
              </div>
            </div>
            <span className="truncate text-sm text-muted-foreground">{a.title}</span>
            <LikeButton id={t.id} subtle />
            <span className="justify-self-end text-sm tabular-nums text-muted-foreground">{fmt(t.duration)}</span>
          </div>
        );
      })}
    </div>
  );
}

export function LikeButton({ id, subtle, size = "h-4 w-4" }: { id: number; subtle?: boolean; size?: string }) {
  const p = usePlayer();
  const on = p.liked.has(id);
  return (
    <button
      onClick={(e) => { e.stopPropagation(); p.toggleLike(id); }}
      className={`transition-all active:scale-75 ${on ? "text-primary" : `text-muted-foreground hover:text-foreground ${subtle ? "opacity-0 group-hover:opacity-100" : ""}`}`}
      aria-label="Curtir"
    >
      <Heart key={String(on)} className={`${size} ${on ? "animate-pop fill-current" : ""}`} />
    </button>
  );
}

export function Card({ cover, title, subtitle, onPlay, onClick, round, delay = 0 }: {
  cover: string; title: string; subtitle: string; onPlay?: () => void; onClick?: () => void; round?: boolean; delay?: number;
}) {
  return (
    <div onClick={onClick} className="animate-fade-up group cursor-pointer rounded-xl p-3 transition-colors hover:bg-surface-hover" style={{ animationDelay: `${delay}ms` }}>
      <div className="relative mb-3">
        <img src={cover} alt={title} loading="lazy" className={`aspect-square w-full object-cover shadow-cover transition-transform duration-500 group-hover:scale-[1.03] ${round ? "rounded-full" : "rounded-lg"}`} />
        {onPlay && (
          <button
            onClick={(e) => { e.stopPropagation(); onPlay(); }}
            className="absolute bottom-2 right-2 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-cover transition-all duration-300 hover:scale-110 group-hover:translate-y-0 group-hover:opacity-100"
          >
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          </button>
        )}
      </div>
      <div className="truncate font-semibold">{title}</div>
      <div className="truncate text-sm text-muted-foreground">{subtitle}</div>
    </div>
  );
}
