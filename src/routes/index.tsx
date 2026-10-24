import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { albums, albumOf, playlists, tracks, tracksOf } from "@/lib/music-data";
import { usePlayer } from "@/components/player/PlayerContext";
import { PageHeader } from "@/components/player/PageHeader";
import { Card } from "@/components/player/ui";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Início — Aura" },
      { name: "description", content: "Suas músicas, álbuns e playlists favoritas em um player elegante." },
      { property: "og:title", content: "Início — Aura" },
      { property: "og:description", content: "Suas músicas, álbuns e playlists favoritas em um player elegante." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

function HomePage() {
  const p = usePlayer();
  const nav = useNavigate();
  const hero = albums[1]!;
  return (
    <div className="relative">
      <div className="animate-ambient pointer-events-none absolute inset-x-0 top-0 h-80 opacity-40 blur-3xl" style={{ backgroundImage: `url(${albumOf(p.track).cover})`, backgroundSize: "cover" }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-transparent to-surface" />
      <div className="relative">
        <PageHeader />
        <div className="px-6 pb-10">
          <h1 className="animate-fade-up mb-5 text-3xl font-bold">{greeting()}</h1>
          <div className="mb-10 grid grid-cols-2 gap-3 xl:grid-cols-4">
            {[...albums, ...playlists.map((pl, i) => ({ ...albums[i]!, title: pl.name, cover: pl.cover }))].slice(0, 8).map((a, i) => (
              <div
                key={i}
                onClick={() => nav({ to: "/album/$id", params: { id: a.id } })}
                className="animate-fade-up group flex cursor-pointer items-center gap-3 overflow-hidden rounded-md bg-surface-hover pr-3 transition-colors hover:bg-accent"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <img src={a.cover} alt="" className="h-14 w-14 object-cover" loading="lazy" />
                <span className="flex-1 truncate text-sm font-semibold">{a.title}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); const l = tracksOf(a.id); p.playTrack(l[0]!, l); }}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-cover transition-all group-hover:opacity-100"
                >
                  <Play className="ml-0.5 h-4 w-4 fill-current" />
                </button>
              </div>
            ))}
          </div>

          <section className="animate-fade-up group relative mb-10 h-64 overflow-hidden rounded-2xl" style={{ animationDelay: "200ms" }}>
            <img src={hero.cover} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-8">
              <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Lançamento</span>
              <h2 className="text-5xl font-extrabold tracking-tight">{hero.title}</h2>
              <p className="mb-4 text-muted-foreground">{hero.artist} • {hero.genre}</p>
              <button
                onClick={() => { const l = tracksOf(hero.id); p.playTrack(l[0]!, l); }}
                className="flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
              >
                <Play className="h-4 w-4 fill-current" /> Ouvir agora
              </button>
            </div>
          </section>

          <h2 className="mb-2 text-2xl font-bold">Feito para você</h2>
          <div className="mb-8 grid grid-cols-4 gap-2">
            {albums.map((a, i) => (
              <Card key={a.id} cover={a.cover} title={a.title} subtitle={a.artist} delay={i * 60}
                onClick={() => nav({ to: "/album/$id", params: { id: a.id } })}
                onPlay={() => { const l = tracksOf(a.id); p.playTrack(l[0]!, l); }} />
            ))}
          </div>

          <h2 className="mb-2 text-2xl font-bold">Artistas populares</h2>
          <div className="grid grid-cols-4 gap-2">
            {albums.map((a, i) => (
              <Card key={a.id} round cover={a.cover} title={a.artist} subtitle="Artista" delay={i * 60}
                onClick={() => nav({ to: "/album/$id", params: { id: a.id } })}
                onPlay={() => p.playTrack(tracks.find((t) => t.albumId === a.id)!, tracksOf(a.id))} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
