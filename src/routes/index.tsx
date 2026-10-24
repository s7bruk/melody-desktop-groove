import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Home, Search, Library, Radio, Plus, Heart, Play, Pause, SkipBack, SkipForward,
  Shuffle, Repeat, Volume2, ListMusic, Mic2, MonitorSpeaker, Clock, ChevronLeft, ChevronRight, MoreHorizontal,
} from "lucide-react";
import c1 from "@/assets/cover1.jpg";
import c2 from "@/assets/cover2.jpg";
import c3 from "@/assets/cover3.jpg";
import c4 from "@/assets/cover4.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aura — Seu player de música" },
      { name: "description", content: "Ouça, explore e organize suas músicas em um player desktop elegante." },
      { property: "og:title", content: "Aura — Seu player de música" },
      { property: "og:description", content: "Ouça, explore e organize suas músicas em um player desktop elegante." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Player,
});

type Track = { title: string; artist: string; album: string; cover: string; duration: number };

const tracks: Track[] = [
  { title: "Golden Hour", artist: "Solenne", album: "Sol Poente", cover: c1, duration: 214 },
  { title: "Neon Rain", artist: "Midnight Avenue", album: "Cidade Elétrica", cover: c2, duration: 187 },
  { title: "Tide", artist: "Marée", album: "Azul Profundo", cover: c3, duration: 243 },
  { title: "Mirage", artist: "Dunas", album: "Horizonte", cover: c4, duration: 201 },
  { title: "Ember", artist: "Solenne", album: "Sol Poente", cover: c1, duration: 176 },
  { title: "Afterglow", artist: "Midnight Avenue", album: "Cidade Elétrica", cover: c2, duration: 229 },
  { title: "Saltwater", artist: "Marée", album: "Azul Profundo", cover: c3, duration: 198 },
  { title: "Wanderer", artist: "Dunas", album: "Horizonte", cover: c4, duration: 255 },
];

const playlists = ["Favoritas", "Foco Profundo", "Noite de Chuva", "Road Trip", "Lo-fi Café", "Treino", "Indie Brasil"];

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

function Player() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [liked, setLiked] = useState<Set<number>>(new Set([0, 2]));
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const track = tracks[current];

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p + 1 >= track.duration) {
          if (repeat) return 0;
          setCurrent((c) => (shuffle ? Math.floor(Math.random() * tracks.length) : (c + 1) % tracks.length));
          return 0;
        }
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing, track.duration, repeat, shuffle]);

  const play = (i: number) => {
    if (i === current) setPlaying((p) => !p);
    else { setCurrent(i); setProgress(0); setPlaying(true); }
  };
  const next = () => { setCurrent((c) => (c + 1) % tracks.length); setProgress(0); };
  const prev = () => { if (progress > 3) setProgress(0); else { setCurrent((c) => (c - 1 + tracks.length) % tracks.length); setProgress(0); } };
  const toggleLike = (i: number) => setLiked((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <div className="flex h-screen min-w-[1100px] flex-col overflow-hidden bg-background text-foreground">
      <div className="flex min-h-0 flex-1 gap-2 p-2">
        {/* Sidebar */}
        <aside className="flex w-64 shrink-0 flex-col gap-2">
          <nav className="rounded-xl bg-surface p-4">
            <div className="mb-5 flex items-center gap-2 px-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-primary" />
              <span className="font-display text-xl font-bold tracking-tight">Aura</span>
            </div>
            {[{ i: Home, l: "Início", a: true }, { i: Search, l: "Buscar" }, { i: Radio, l: "Rádio" }].map(({ i: Icon, l, a }) => (
              <button key={l} className={`flex w-full items-center gap-4 rounded-md px-2 py-2 text-sm font-semibold transition-colors ${a ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                <Icon className="h-5 w-5" /> {l}
              </button>
            ))}
          </nav>
          <div className="flex min-h-0 flex-1 flex-col rounded-xl bg-surface p-4">
            <div className="mb-3 flex items-center justify-between px-2 text-muted-foreground">
              <span className="flex items-center gap-3 text-sm font-semibold"><Library className="h-5 w-5" /> Sua Biblioteca</span>
              <button className="rounded-full p-1 hover:bg-surface-hover hover:text-foreground"><Plus className="h-4 w-4" /></button>
            </div>
            <div className="scrollbar-thin -mx-2 flex-1 overflow-y-auto">
              {playlists.map((p, i) => (
                <button key={p} className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left hover:bg-surface-hover">
                  <img src={tracks[i % 4].cover} alt="" className="h-11 w-11 rounded-md object-cover" loading="lazy" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{p}</div>
                    <div className="truncate text-xs text-muted-foreground">Playlist • {12 + i * 7} músicas</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="scrollbar-thin relative min-w-0 flex-1 overflow-y-auto rounded-xl bg-surface">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-80 opacity-50 blur-3xl transition-all duration-700" style={{ backgroundImage: `url(${track.cover})`, backgroundSize: "cover" }} />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-transparent to-surface" />
          <div className="relative p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex gap-2">
                <button className="glass rounded-full p-1.5"><ChevronLeft className="h-5 w-5" /></button>
                <button className="glass rounded-full p-1.5"><ChevronRight className="h-5 w-5" /></button>
              </div>
              <div className="glass flex w-80 items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground">
                <Search className="h-4 w-4" /> <input placeholder="O que você quer ouvir?" className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground" />
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">A</div>
            </div>

            <section className="mb-8 flex items-end gap-6">
              <img src={track.cover} alt={track.album} className="h-52 w-52 rounded-xl object-cover shadow-cover" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Tocando agora</p>
                <h1 className="my-2 text-6xl font-extrabold tracking-tight">{track.album}</h1>
                <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{track.artist}</span> • 2026 • {tracks.length} músicas</p>
              </div>
            </section>

            <div className="mb-6 flex items-center gap-5">
              <button onClick={() => setPlaying((p) => !p)} className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-cover transition-transform hover:scale-105">
                {playing ? <Pause className="h-6 w-6 fill-current" /> : <Play className="ml-1 h-6 w-6 fill-current" />}
              </button>
              <button onClick={() => setShuffle(!shuffle)} className={shuffle ? "text-primary" : "text-muted-foreground hover:text-foreground"}><Shuffle className="h-6 w-6" /></button>
              <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-6 w-6" /></button>
            </div>

            <div className="mb-10">
              <div className="grid grid-cols-[2rem_1fr_1fr_3rem_4rem] gap-4 border-b px-4 pb-2 text-xs uppercase tracking-wider text-muted-foreground">
                <span>#</span><span>Título</span><span>Álbum</span><span /><Clock className="h-4 w-4 justify-self-end" />
              </div>
              {tracks.map((t, i) => {
                const active = i === current;
                return (
                  <div key={i} onDoubleClick={() => play(i)} className="group grid grid-cols-[2rem_1fr_1fr_3rem_4rem] items-center gap-4 rounded-md px-4 py-2 hover:bg-surface-hover">
                    <button onClick={() => play(i)} className={`text-sm ${active ? "text-primary" : "text-muted-foreground"}`}>
                      <span className="group-hover:hidden">{active && playing ? <Equalizer /> : i + 1}</span>
                      <span className="hidden group-hover:inline">{active && playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}</span>
                    </button>
                    <div className="flex min-w-0 items-center gap-3">
                      <img src={t.cover} alt="" className="h-10 w-10 rounded object-cover" loading="lazy" />
                      <div className="min-w-0">
                        <div className={`truncate text-sm font-semibold ${active ? "text-primary" : ""}`}>{t.title}</div>
                        <div className="truncate text-xs text-muted-foreground">{t.artist}</div>
                      </div>
                    </div>
                    <span className="truncate text-sm text-muted-foreground">{t.album}</span>
                    <button onClick={() => toggleLike(i)} className={liked.has(i) ? "text-primary" : "text-muted-foreground opacity-0 group-hover:opacity-100"}>
                      <Heart className={`h-4 w-4 ${liked.has(i) ? "fill-current" : ""}`} />
                    </button>
                    <span className="justify-self-end text-sm tabular-nums text-muted-foreground">{fmt(t.duration)}</span>
                  </div>
                );
              })}
            </div>

            <h2 className="mb-4 text-2xl font-bold">Feito para você</h2>
            <div className="grid grid-cols-4 gap-5">
              {tracks.slice(0, 4).map((t, i) => (
                <button key={i} onClick={() => play(i)} className="group rounded-xl p-3 text-left transition-colors hover:bg-surface-hover">
                  <div className="relative mb-3">
                    <img src={t.cover} alt={t.album} className="aspect-square w-full rounded-lg object-cover shadow-cover" loading="lazy" />
                    <span className="absolute bottom-2 right-2 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-cover transition-all group-hover:translate-y-0 group-hover:opacity-100">
                      <Play className="ml-0.5 h-5 w-5 fill-current" />
                    </span>
                  </div>
                  <div className="truncate font-semibold">{t.album}</div>
                  <div className="truncate text-sm text-muted-foreground">{t.artist}</div>
                </button>
              ))}
            </div>
          </div>
        </main>

        {/* Now playing panel */}
        <aside className="scrollbar-thin flex w-80 shrink-0 flex-col overflow-y-auto rounded-xl bg-surface p-4">
          <p className="mb-4 text-sm font-bold">{track.album}</p>
          <img src={track.cover} alt="" className="mb-4 aspect-square w-full rounded-xl object-cover shadow-cover" />
          <div className="mb-6 flex items-start justify-between">
            <div className="min-w-0">
              <h3 className="truncate text-2xl font-bold">{track.title}</h3>
              <p className="text-muted-foreground">{track.artist}</p>
            </div>
            <button onClick={() => toggleLike(current)} className={liked.has(current) ? "text-primary" : "text-muted-foreground"}>
              <Heart className={`h-6 w-6 ${liked.has(current) ? "fill-current" : ""}`} />
            </button>
          </div>
          <div className="rounded-xl bg-muted p-4">
            <p className="mb-3 text-sm font-bold">A seguir</p>
            {[1, 2, 3].map((o) => {
              const idx = (current + o) % tracks.length;
              const t = tracks[idx];
              return (
                <button key={o} onClick={() => play(idx)} className="flex w-full items-center gap-3 rounded-md p-1.5 text-left hover:bg-surface-hover">
                  <img src={t.cover} alt="" className="h-10 w-10 rounded object-cover" loading="lazy" />
                  <div className="min-w-0"><div className="truncate text-sm font-semibold">{t.title}</div><div className="truncate text-xs text-muted-foreground">{t.artist}</div></div>
                </button>
              );
            })}
          </div>
        </aside>
      </div>

      {/* Player bar */}
      <footer className="grid h-20 shrink-0 grid-cols-[1fr_2fr_1fr] items-center px-4">
        <div className="flex min-w-0 items-center gap-3">
          <img src={track.cover} alt="" className="h-14 w-14 rounded-md object-cover" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{track.title}</div>
            <div className="truncate text-xs text-muted-foreground">{track.artist}</div>
          </div>
          <button onClick={() => toggleLike(current)} className={`ml-2 ${liked.has(current) ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            <Heart className={`h-4 w-4 ${liked.has(current) ? "fill-current" : ""}`} />
          </button>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-6">
            <button onClick={() => setShuffle(!shuffle)} className={shuffle ? "text-primary" : "text-muted-foreground hover:text-foreground"}><Shuffle className="h-4 w-4" /></button>
            <button onClick={prev} className="text-muted-foreground hover:text-foreground"><SkipBack className="h-5 w-5 fill-current" /></button>
            <button onClick={() => setPlaying((p) => !p)} className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-background transition-transform hover:scale-105">
              {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
            </button>
            <button onClick={next} className="text-muted-foreground hover:text-foreground"><SkipForward className="h-5 w-5 fill-current" /></button>
            <button onClick={() => setRepeat(!repeat)} className={repeat ? "text-primary" : "text-muted-foreground hover:text-foreground"}><Repeat className="h-4 w-4" /></button>
          </div>
          <div className="flex w-full max-w-xl items-center gap-2 text-xs tabular-nums text-muted-foreground">
            <span className="w-10 text-right">{fmt(progress)}</span>
            <Slider value={progress} max={track.duration} onChange={setProgress} />
            <span className="w-10">{fmt(track.duration)}</span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 text-muted-foreground">
          <Mic2 className="h-4 w-4 hover:text-foreground" />
          <ListMusic className="h-4 w-4 hover:text-foreground" />
          <MonitorSpeaker className="h-4 w-4 hover:text-foreground" />
          <Volume2 className="h-4 w-4" />
          <div className="w-28"><Slider value={volume} max={100} onChange={setVolume} /></div>
        </div>
      </footer>
    </div>
  );
}

function Slider({ value, max, onChange }: { value: number; max: number; onChange: (v: number) => void }) {
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

function Equalizer() {
  return (
    <span className="inline-flex h-3 items-end gap-0.5">
      {[0, 150, 300].map((d) => (
        <span key={d} className="w-0.5 animate-pulse bg-primary" style={{ height: "100%", animationDelay: `${d}ms` }} />
      ))}
    </span>
  );
}
