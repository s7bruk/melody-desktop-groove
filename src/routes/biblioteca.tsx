import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Heart, Play } from "lucide-react";
import { useState } from "react";
import { albums, playlists, tracks, tracksOf } from "@/lib/music-data";
import { usePlayer } from "@/components/player/PlayerContext";
import { PageHeader } from "@/components/player/PageHeader";
import { Card, TrackList } from "@/components/player/ui";

export const Route = createFileRoute("/biblioteca")({
  head: () => ({
    meta: [
      { title: "Biblioteca — Aura" },
      { name: "description", content: "Suas músicas curtidas, playlists e álbuns salvos." },
      { property: "og:title", content: "Biblioteca — Aura" },
      { property: "og:description", content: "Suas músicas curtidas, playlists e álbuns salvos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LibraryPage,
});

const tabs = ["Curtidas", "Playlists", "Álbuns", "Artistas"] as const;

function LibraryPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Curtidas");
  const p = usePlayer();
  const nav = useNavigate();
  const liked = tracks.filter((t) => p.liked.has(t.id));

  return (
    <div>
      <PageHeader>
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${tab === t ? "bg-foreground text-background" : "bg-surface-hover hover:bg-accent"}`}>
              {t}
            </button>
          ))}
        </div>
      </PageHeader>
      <div key={tab} className="animate-page-in px-6 pb-10">
        {tab === "Curtidas" && (
          <>
            <div className="mb-6 flex items-end gap-6">
              <div className="flex h-44 w-44 items-center justify-center rounded-xl bg-gradient-primary shadow-cover">
                <Heart className="animate-heartbeat h-16 w-16 fill-current text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Playlist</p>
                <h1 className="my-2 text-5xl font-extrabold">Músicas Curtidas</h1>
                <p className="text-sm text-muted-foreground">{liked.length} músicas</p>
              </div>
            </div>
            {liked.length ? (
              <>
                <button onClick={() => p.playTrack(liked[0]!, liked)} className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-cover transition-transform hover:scale-105">
                  <Play className="ml-1 h-6 w-6 fill-current" />
                </button>
                <TrackList list={liked} />
              </>
            ) : (
              <p className="py-10 text-center text-muted-foreground">Toque no coração de uma música para salvá-la aqui.</p>
            )}
          </>
        )}
        {tab === "Playlists" && (
          <div className="grid grid-cols-4 gap-2">
            {playlists.map((pl, i) => (
              <Card key={pl.name} cover={pl.cover} title={pl.name} subtitle={`${pl.count} músicas`} delay={i * 60}
                onPlay={() => { const l = tracksOf(albums[i]!.id); p.playTrack(l[0]!, l); }} />
            ))}
          </div>
        )}
        {tab === "Álbuns" && (
          <div className="grid grid-cols-4 gap-2">
            {albums.map((a, i) => (
              <Card key={a.id} cover={a.cover} title={a.title} subtitle={`${a.artist} • ${a.year}`} delay={i * 60}
                onClick={() => nav({ to: "/album/$id", params: { id: a.id } })}
                onPlay={() => { const l = tracksOf(a.id); p.playTrack(l[0]!, l); }} />
            ))}
          </div>
        )}
        {tab === "Artistas" && (
          <div className="grid grid-cols-4 gap-2">
            {albums.map((a, i) => (
              <Card key={a.id} round cover={a.cover} title={a.artist} subtitle="Artista" delay={i * 60}
                onClick={() => nav({ to: "/album/$id", params: { id: a.id } })} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
