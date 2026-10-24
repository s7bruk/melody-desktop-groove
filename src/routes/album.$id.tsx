import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock, MoreHorizontal, Pause, Play, Shuffle } from "lucide-react";
import { albums, fmt, tracksOf } from "@/lib/music-data";
import { usePlayer } from "@/components/player/PlayerContext";
import { PageHeader } from "@/components/player/PageHeader";
import { TrackList } from "@/components/player/ui";

export const Route = createFileRoute("/album/$id")({
  loader: ({ params }) => {
    const album = albums.find((a) => a.id === params.id);
    if (!album) throw notFound();
    return { album };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.album.title ?? "Álbum"} — Aura` },
      { name: "description", content: `Ouça ${loaderData?.album.title} de ${loaderData?.album.artist} no Aura.` },
      { property: "og:title", content: `${loaderData?.album.title ?? "Álbum"} — Aura` },
      { property: "og:description", content: `Ouça ${loaderData?.album.title} de ${loaderData?.album.artist} no Aura.` },
      { property: "og:type", content: "music.album" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  notFoundComponent: () => (
    <div className="p-10 text-center">
      <p className="mb-4 text-muted-foreground">Álbum não encontrado.</p>
      <Link to="/" className="text-primary hover:underline">Voltar ao início</Link>
    </div>
  ),
  component: AlbumPage,
});

function AlbumPage() {
  const { album } = Route.useLoaderData();
  const p = usePlayer();
  const list = tracksOf(album.id);
  const total = list.reduce((s, t) => s + t.duration, 0);
  const isThis = p.track.albumId === album.id;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] opacity-60 blur-3xl" style={{ backgroundImage: `url(${album.cover})`, backgroundSize: "cover" }} />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-gradient-to-b from-transparent to-surface" />
      <div className="relative">
        <PageHeader />
        <section className="flex items-end gap-6 px-6 pb-6">
          <img src={album.cover} alt={album.title} className="animate-scale-in h-56 w-56 rounded-xl object-cover shadow-cover" />
          <div className="animate-fade-up" style={{ animationDelay: "100ms" }}>
            <p className="text-xs font-semibold uppercase tracking-widest">Álbum</p>
            <h1 className="my-2 text-7xl font-extrabold tracking-tight">{album.title}</h1>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{album.artist}</span> • {album.year} • {list.length} músicas, {fmt(total)}
            </p>
          </div>
        </section>
        <div className="px-6 pb-10">
          <div className="mb-6 flex items-center gap-5">
            <button onClick={() => (isThis ? p.toggle() : p.playTrack(list[0]!, list))} className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-cover transition-transform hover:scale-105 active:scale-95">
              {isThis && p.playing ? <Pause className="h-6 w-6 fill-current" /> : <Play className="ml-1 h-6 w-6 fill-current" />}
            </button>
            <button onClick={p.toggleShuffle} className={p.shuffle ? "text-primary" : "text-muted-foreground hover:text-foreground"}><Shuffle className="h-6 w-6" /></button>
            <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-6 w-6" /></button>
          </div>
          <div className="grid grid-cols-[2rem_1fr_1fr_3rem_4rem] gap-4 border-b px-4 pb-2 text-xs uppercase tracking-wider text-muted-foreground">
            <span>#</span><span>Título</span><span>Álbum</span><span /><Clock className="h-4 w-4 justify-self-end" />
          </div>
          <TrackList list={list} showCover={false} />
        </div>
      </div>
    </div>
  );
}
