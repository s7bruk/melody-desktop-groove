import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Home, Search, Library, Radio, Plus, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat,
  Volume2, ListMusic, Mic2, Maximize2, ChevronDown,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { albumOf, albums, fmt, lyrics, playlists } from "@/lib/music-data";
import { usePlayer } from "./PlayerContext";
import { Equalizer, LikeButton, Slider } from "./ui";

const nav = [
  { to: "/", label: "Início", icon: Home },
  { to: "/buscar", label: "Buscar", icon: Search },
  { to: "/biblioteca", label: "Biblioteca", icon: Library },
  { to: "/radio", label: "Rádio", icon: Radio },
] as const;

export function Shell() {
  const p = usePlayer();
  const album = albumOf(p.track);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [queueOpen, setQueueOpen] = useState(false);
  const pct = (p.progress / p.track.duration) * 100;

  return (
    <div className="relative flex h-screen min-w-[1100px] flex-col overflow-hidden bg-background text-foreground">
      <div key={album.id} className="animate-ambient pointer-events-none absolute -inset-1/4 opacity-25 blur-[120px]" style={{ backgroundImage: `url(${album.cover})`, backgroundSize: "cover" }} />

      {/* Top bar */}
      <header className="relative z-20 flex shrink-0 items-center gap-6 px-8 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className={`h-8 w-8 rounded-full bg-gradient-primary ${p.playing ? "animate-spin-slow" : ""}`} />
          <span className="font-display text-2xl font-extrabold tracking-tight">Aura</span>
        </Link>
        <nav className="glass mx-auto flex items-center gap-1 rounded-full p-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to} to={to} activeOptions={{ exact: to === "/" }}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-all hover:text-foreground data-[status=active]:bg-foreground data-[status=active]:text-background"
            >
              <Icon className="h-4 w-4" /> {label}
            </Link>
          ))}
        </nav>
        <button onClick={() => setQueueOpen((o) => !o)} className={`glass flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${queueOpen ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
          <ListMusic className="h-4 w-4" /> Fila
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">A</div>
      </header>

      <div className="relative flex min-h-0 flex-1">
        {/* Album rail */}
        <aside className="flex w-20 shrink-0 flex-col items-center gap-3 py-4">
          {[...playlists.map((pl) => ({ key: pl.name, cover: pl.cover, label: pl.name, to: "/biblioteca" as const, id: "" })), ...albums.map((a) => ({ key: a.id, cover: a.cover, label: a.title, to: "/album/$id" as const, id: a.id }))].map((it, i) => (
            <Link
              key={it.key} to={it.to} params={{ id: it.id }} title={it.label}
              className="animate-fade-up group relative"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <img src={it.cover} alt={it.label} loading="lazy" className={`h-12 w-12 object-cover shadow-cover transition-all duration-300 group-hover:rounded-xl ${it.id === album.id ? "rounded-xl ring-2 ring-primary" : "rounded-3xl"}`} />
              <span className="pointer-events-none absolute left-16 top-1/2 z-30 -translate-y-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs font-semibold opacity-0 transition-opacity group-hover:opacity-100">{it.label}</span>
            </Link>
          ))}
          <button className="flex h-12 w-12 items-center justify-center rounded-3xl border border-dashed text-muted-foreground transition-all hover:rounded-xl hover:text-primary"><Plus className="h-5 w-5" /></button>
        </aside>

        <main className="scrollbar-thin relative min-w-0 flex-1 overflow-y-auto rounded-tl-3xl bg-surface/80 pb-32">
          <div key={pathname} className="animate-page-in min-h-full">
            <Outlet />
          </div>
        </main>

        {/* Queue drawer */}
        <aside className={`shrink-0 overflow-hidden bg-surface/80 transition-all duration-500 ${queueOpen ? "w-80 border-l" : "w-0"}`}>
          <div className="w-80 p-5 pb-32">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Tocando</p>
            <div className="mb-6 flex items-center gap-3">
              <img src={album.cover} alt="" className="h-14 w-14 rounded-md object-cover" />
              <div className="min-w-0"><div className="truncate font-semibold text-primary">{p.track.title}</div><div className="truncate text-sm text-muted-foreground">{album.artist}</div></div>
              {p.playing && <Equalizer className="ml-auto" />}
            </div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">A seguir</p>
            {p.queue.slice(0, 10).map((t) => {
              const a = albumOf(t);
              return (
                <button key={t.id} onClick={() => p.playTrack(t)} className="flex w-full items-center gap-3 rounded-md p-1.5 text-left transition-colors hover:bg-surface-hover">
                  <img src={a.cover} alt="" className="h-10 w-10 rounded object-cover" loading="lazy" />
                  <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold">{t.title}</div><div className="truncate text-xs text-muted-foreground">{a.artist}</div></div>
                  <span className="text-xs tabular-nums text-muted-foreground">{fmt(t.duration)}</span>
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      {/* Floating player */}
      <footer className="glass absolute bottom-5 left-1/2 z-30 grid w-[min(1000px,calc(100%-3rem))] -translate-x-1/2 grid-cols-[1fr_auto_1fr] items-center gap-6 overflow-hidden rounded-full border py-2.5 pl-2.5 pr-6 shadow-cover">
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary transition-all duration-1000 ease-linear" style={{ width: `${pct}%` }} />
        <div className="flex min-w-0 items-center gap-3">
          <button onClick={() => p.setFullscreen(true)} className="group relative shrink-0" aria-label="Tela cheia">
            <img key={album.id} src={album.cover} alt="" className={`h-14 w-14 rounded-full object-cover ${p.playing ? "animate-spin-slow" : ""}`} />
            <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background" />
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-background/60 opacity-0 transition-opacity group-hover:opacity-100"><Maximize2 className="h-4 w-4" /></span>
          </button>
          <div key={p.track.id} className="animate-fade-up min-w-0">
            <div className="truncate text-sm font-semibold">{p.track.title}</div>
            <Link to="/album/$id" params={{ id: album.id }} className="truncate text-xs text-muted-foreground hover:underline">{album.artist}</Link>
          </div>
          <span className="ml-1"><LikeButton id={p.track.id} /></span>
        </div>
        <div className="flex items-center gap-5">
          <button onClick={p.toggleShuffle} className={p.shuffle ? "text-primary" : "text-muted-foreground hover:text-foreground"}><Shuffle className="h-4 w-4" /></button>
          <button onClick={p.prev} className="text-muted-foreground transition-transform hover:text-foreground active:scale-90"><SkipBack className="h-5 w-5 fill-current" /></button>
          <button onClick={p.toggle} className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 active:scale-95">
            {p.playing ? <Pause className="h-5 w-5 fill-current" /> : <Play className="ml-0.5 h-5 w-5 fill-current" />}
          </button>
          <button onClick={p.next} className="text-muted-foreground transition-transform hover:text-foreground active:scale-90"><SkipForward className="h-5 w-5 fill-current" /></button>
          <button onClick={p.toggleRepeat} className={p.repeat ? "text-primary" : "text-muted-foreground hover:text-foreground"}><Repeat className="h-4 w-4" /></button>
        </div>
        <div className="flex items-center justify-end gap-4 text-muted-foreground">
          <span className="text-xs tabular-nums">{fmt(p.progress)} / {fmt(p.track.duration)}</span>
          <button onClick={() => p.setFullscreen(true)} className="hover:text-foreground" aria-label="Letra"><Mic2 className="h-4 w-4" /></button>
          <Volume2 className="h-4 w-4" />
          <div className="w-24"><Slider value={p.volume} max={100} onChange={p.setVolume} /></div>
        </div>
      </footer>

      {p.fullscreen && <NowPlaying />}
    </div>
  );
}

function Controls({ big }: { big?: boolean }) {
  const p = usePlayer();
  const s = big ? "h-7 w-7" : "h-5 w-5";
  return (
    <div className="flex w-full flex-col items-center gap-1.5">
      <div className={`flex items-center ${big ? "gap-10" : "gap-6"}`}>
        <button onClick={p.toggleShuffle} className={p.shuffle ? "text-primary" : "text-muted-foreground hover:text-foreground"}><Shuffle className="h-4 w-4" /></button>
        <button onClick={p.prev} className="text-muted-foreground transition-transform hover:text-foreground active:scale-90"><SkipBack className={`${s} fill-current`} /></button>
        <button onClick={p.toggle} className={`flex items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-105 active:scale-95 ${big ? "h-16 w-16" : "h-9 w-9"}`}>
          {p.playing ? <Pause className={`${big ? "h-7 w-7" : "h-4 w-4"} fill-current`} /> : <Play className={`ml-0.5 ${big ? "h-7 w-7" : "h-4 w-4"} fill-current`} />}
        </button>
        <button onClick={p.next} className="text-muted-foreground transition-transform hover:text-foreground active:scale-90"><SkipForward className={`${s} fill-current`} /></button>
        <button onClick={p.toggleRepeat} className={p.repeat ? "text-primary" : "text-muted-foreground hover:text-foreground"}><Repeat className="h-4 w-4" /></button>
      </div>
      <div className="flex w-full max-w-xl items-center gap-2 text-xs tabular-nums text-muted-foreground">
        <span className="w-10 text-right">{fmt(p.progress)}</span>
        <Slider value={p.progress} max={p.track.duration} onChange={p.seek} />
        <span className="w-10">{fmt(p.track.duration)}</span>
      </div>
    </div>
  );
}

function NowPlaying() {
  const p = usePlayer();
  const album = albumOf(p.track);
  const line = Math.floor((p.progress / p.track.duration) * lyrics.length);
  const lyricsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = lyricsRef.current?.querySelector<HTMLElement>(`[data-line="${line}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [line]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && p.setFullscreen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [p]);

  return (
    <div className="animate-slide-up fixed inset-0 z-50 overflow-hidden bg-background">
      <div key={album.id} className="animate-ambient absolute -inset-1/4 scale-125 opacity-70 blur-[100px]" style={{ backgroundImage: `url(${album.cover})`, backgroundSize: "cover" }} />
      <div className="absolute inset-0 bg-background/40" />
      <div className="relative flex h-full flex-col p-8">
        <button onClick={() => p.setFullscreen(false)} className="glass self-start rounded-full p-2 transition-transform hover:scale-110" aria-label="Fechar">
          <ChevronDown className="h-6 w-6" />
        </button>
        <div className="grid min-h-0 flex-1 grid-cols-2 items-center gap-16 px-12">
          <div className="flex flex-col items-center gap-8">
            <img
              key={album.id} src={album.cover} alt={album.title}
              className={`animate-scale-in aspect-square w-full max-w-md rounded-2xl object-cover shadow-cover transition-transform duration-700 ${p.playing ? "scale-100" : "scale-90"}`}
            />
            <div className="flex w-full max-w-md items-center justify-between">
              <div key={p.track.id} className="animate-fade-up min-w-0">
                <h2 className="truncate text-3xl font-bold">{p.track.title}</h2>
                <p className="text-lg text-muted-foreground">{album.artist} — {album.title}</p>
              </div>
              <LikeButton id={p.track.id} size="h-7 w-7" />
            </div>
            <div className="w-full max-w-md"><Controls big /></div>
          </div>
          <div ref={lyricsRef} className="scrollbar-none h-full overflow-y-auto py-[40vh] mask-fade">
            {lyrics.map((l, i) => (
              <p
                key={i} data-line={i}
                onClick={() => p.seek(Math.floor((i / lyrics.length) * p.track.duration))}
                className={`cursor-pointer py-3 font-display text-4xl font-bold transition-all duration-500 ${i === line ? "scale-100 text-foreground" : "origin-left scale-95 text-foreground/30 blur-[1px] hover:text-foreground/60"}`}
              >
                {l}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
