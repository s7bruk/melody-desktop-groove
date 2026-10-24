import { createFileRoute } from "@tanstack/react-router";
import { Pause, Play, Radio as RadioIcon } from "lucide-react";
import { stations, tracksOf } from "@/lib/music-data";
import { usePlayer } from "@/components/player/PlayerContext";
import { PageHeader } from "@/components/player/PageHeader";
import { Equalizer } from "@/components/player/ui";

export const Route = createFileRoute("/radio")({
  head: () => ({
    meta: [
      { title: "Rádio — Aura" },
      { name: "description", content: "Estações ao vivo para cada momento do seu dia." },
      { property: "og:title", content: "Rádio — Aura" },
      { property: "og:description", content: "Estações ao vivo para cada momento do seu dia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RadioPage,
});

function RadioPage() {
  const p = usePlayer();
  return (
    <div>
      <PageHeader />
      <div className="px-6 pb-10">
        <h1 className="animate-fade-up mb-1 text-4xl font-extrabold">Rádio</h1>
        <p className="mb-8 text-muted-foreground">Estações ao vivo, selecionadas para você.</p>
        <div className="grid grid-cols-2 gap-5">
          {stations.map((s, i) => {
            const live = p.track.albumId === s.album.id && p.playing;
            return (
              <button
                key={s.name}
                onClick={() => { const l = tracksOf(s.album.id); if (p.track.albumId === s.album.id) p.toggle(); else p.playTrack(l[0]!, l); }}
                className="animate-fade-up group relative flex h-44 items-center gap-5 overflow-hidden rounded-2xl p-5 text-left"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <img src={s.album.cover} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl transition-transform duration-700 group-hover:scale-125" />
                <div className="absolute inset-0 bg-background/40" />
                <div className="relative">
                  <img src={s.album.cover} alt="" className={`h-32 w-32 rounded-full object-cover shadow-cover ${live ? "animate-spin-slow" : ""}`} />
                  <span className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-surface bg-background" />
                </div>
                <div className="relative flex-1">
                  <span className={`mb-2 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${live ? "bg-primary text-primary-foreground" : "bg-surface-hover text-muted-foreground"}`}>
                    {live ? <Equalizer className="!h-2.5 [&>span]:bg-primary-foreground" /> : <RadioIcon className="h-3 w-3" />} Ao vivo
                  </span>
                  <h3 className="text-2xl font-bold">{s.name}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background transition-transform group-hover:scale-110">
                  {live ? <Pause className="h-5 w-5 fill-current" /> : <Play className="ml-0.5 h-5 w-5 fill-current" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
