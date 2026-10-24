import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Home, Search, Library, Radio, Plus, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat,
  Volume2, ListMusic, Mic2, MonitorSpeaker, Maximize2, ChevronDown,
} from "lucide-react";
import { useEffect, useRef } from "react";
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

  return (
    <div className="flex h-screen min-w-[1100px] flex-col overflow-hidden bg-background text-foreground">
      <div className="flex min-h-0 flex-1 gap-2 p-2">
        <aside className="flex w-64 shrink-0 flex-col gap-2">
          <nav className="rounded-xl bg-surface p-4">
            <div className="mb-5 flex items-center gap-2 px-2">
              <div className="animate-spin-slow h-7 w-7 rounded-full bg-gradient-primary" />
              <span className="font-display text-xl font-bold tracking-tight">Aura</span>
            </div>
            {nav.map(({ to, label, icon: Icon }) => (
              <Link
                key={to} to={to} activeOptions={{ exact: to === "/" }}
                className="relative flex items-center gap-4 rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-surface-hover data-[status=active]:text-foreground"
              >
                <Icon className="h-5 w-5" /> {label}
              </Link>
            ))}
          </nav>
          <div className="flex min-h-0 flex-1 flex-col rounded-xl bg-surface p-4">
            <div className="mb-3 flex items-center justify-between px-2 text-muted-foreground">
              <span className="text-sm font-semibold">Playlists</span>
              <button className="rounded-full p-1 transition-transform hover:rotate-90 hover:bg-surface-hover hover:text-foreground"><Plus className="h-4 w-4" /></button>
            </div>
            <div className="scrollbar-thin -mx-2 flex-1 overflow-y-auto">
              {playlists.map((pl) => (
                <Link key={pl.name} to="/biblioteca" className="flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-surface-hover">
                  <img src={pl.cover} alt="" className="h-11 w-11 rounded-md object-cover" loading="lazy" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{pl.name}</div>
                    <div className="truncate text-xs text-muted-foreground">Playlist • {pl.count} músicas</div>
                  </div>
                </Link>
              ))}
              <div className="mt-3 border-t pt-3">
                {albums.map((a) => (
                  <Link key={a.id} to="/album/$id" params={{ id: a.id }} className="flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-surface-hover">
                    <img src={a.cover} alt="" className="h-11 w-11 rounded-md object-cover" loading="lazy" />
                    <div className="min-w-0">
                      <div className={`truncate text-sm font-semibold ${album.id === a.id ? "text-primary" : ""}`}>{a.title}</div>
                      <div className="truncate text-xs text-muted-foreground">Álbum • {a.artist}</div>
                    </div>
                    {album.id === a.id && p.playing && <Equalizer className="ml-auto" />}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <main className="scrollbar-thin relative min-w-0 flex-1 overflow-y-auto rounded-xl bg-surface">
          <div key={pathname} className="animate-page-in min-h-full">
            <Outlet />
          </div>
        </main>
      </div>

      <footer className="grid h-20 shrink-0 grid-cols-[1fr_2fr_1fr] items-center px-4">
        <div className="flex min-w-0 items-center gap-3">
          <button onClick={() => p.setFullscreen(true)} className="group relative shrink-0">
            <img key={album.id} src={album.cover} alt="" className="animate-scale-in h-14 w-14 rounded-md object-cover" />
            <span className="absolute inset-0 flex items-center justify-center rounded-md bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
              <Maximize2 className="h-4 w-4" />
            </span>
          </button>
          <div key={p.track.id} className="animate-fade-up min-w-0">
            <div className="truncate text-sm font-semibold">{p.track.title}</div>
            <Link to="/album/$id" params={{ id: album.id }} className="truncate text-xs text-muted-foreground hover:underline">{album.artist}</Link>
          </div>
          <span className="ml-2"><LikeButton id={p.track.id} /></span>
        </div>
        <Controls />
        <div className="flex items-center justify-end gap-4 text-muted-foreground">
          <button onClick={() => p.setFullscreen(true)} className="hover:text-foreground"><Mic2 className="h-4 w-4" /></button>
          <ListMusic className="h-4 w-4" />
          <MonitorSpeaker className="h-4 w-4" />
          <Volume2 className="h-4 w-4" />
          <div className="w-28"><Slider value={p.volume} max={100} onChange={p.setVolume} /></div>
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
