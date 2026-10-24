import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { tracks, type Track } from "@/lib/music-data";

type Ctx = {
  track: Track; queue: Track[]; playing: boolean; progress: number; volume: number;
  shuffle: boolean; repeat: boolean; liked: Set<number>; fullscreen: boolean;
  playTrack: (t: Track, queue?: Track[]) => void; toggle: () => void; next: () => void; prev: () => void;
  seek: (v: number) => void; setVolume: (v: number) => void; toggleShuffle: () => void; toggleRepeat: () => void;
  toggleLike: (id: number) => void; setFullscreen: (v: boolean) => void;
};

const PlayerCtx = createContext<Ctx | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<Track[]>(tracks);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [liked, setLiked] = useState<Set<number>>(new Set([0, 11]));
  const [fullscreen, setFullscreen] = useState(false);
  const track = queue[index] ?? tracks[0]!;

  const next = () => {
    setIndex((i) => (shuffle ? Math.floor(Math.random() * queue.length) : (i + 1) % queue.length));
    setProgress(0);
  };

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p + 1 < track.duration) return p + 1;
        if (!repeat) setIndex((i) => (shuffle ? Math.floor(Math.random() * queue.length) : (i + 1) % queue.length));
        return 0;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing, track.duration, repeat, shuffle, queue.length]);

  const value: Ctx = {
    track, queue: [...queue.slice(index + 1), ...queue.slice(0, index)], playing, progress, volume, shuffle, repeat, liked, fullscreen,
    playTrack: (t, q) => {
      if (t.id === track.id) return setPlaying((p) => !p);
      const nq = q ?? queue;
      setQueue(nq);
      setIndex(Math.max(0, nq.findIndex((x) => x.id === t.id)));
      setProgress(0);
      setPlaying(true);
    },
    toggle: () => setPlaying((p) => !p),
    next,
    prev: () => {
      if (progress > 3) return setProgress(0);
      setIndex((i) => (i - 1 + queue.length) % queue.length);
      setProgress(0);
    },
    seek: setProgress, setVolume,
    toggleShuffle: () => setShuffle((s) => !s),
    toggleRepeat: () => setRepeat((r) => !r),
    toggleLike: (id) => setLiked((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; }),
    setFullscreen,
  };
  return <PlayerCtx.Provider value={value}>{children}</PlayerCtx.Provider>;
}

export function usePlayer() {
  const c = useContext(PlayerCtx);
  if (!c) throw new Error("usePlayer outside provider");
  return c;
}
