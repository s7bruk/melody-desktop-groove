import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { albums, albumOf, genres, tracks } from "@/lib/music-data";
import { PageHeader } from "@/components/player/PageHeader";
import { TrackList } from "@/components/player/ui";

export const Route = createFileRoute("/buscar")({
  head: () => ({
    meta: [
      { title: "Buscar — Aura" },
      { name: "description", content: "Encontre músicas, artistas e gêneros no Aura." },
      { property: "og:title", content: "Buscar — Aura" },
      { property: "og:description", content: "Encontre músicas, artistas e gêneros no Aura." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const results = term
    ? tracks.filter((t) => { const a = albumOf(t); return [t.title, a.title, a.artist, a.genre].some((s) => s.toLowerCase().includes(term)); })
    : [];

  return (
    <div>
      <PageHeader>
        <div className="glass mx-auto flex max-w-md items-center gap-2 rounded-full px-4 py-2.5 ring-primary transition-shadow focus-within:ring-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="O que você quer ouvir?" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </div>
      </PageHeader>
      <div className="px-6 pb-10">
        {term ? (
          results.length ? (
            <>
              <h2 className="mb-3 text-2xl font-bold">Resultados</h2>
              <TrackList key={term} list={results} />
            </>
          ) : (
            <p className="animate-fade-up py-20 text-center text-muted-foreground">Nenhum resultado para "{q}"</p>
          )
        ) : (
          <>
            <h2 className="mb-4 text-2xl font-bold">Navegar por gêneros</h2>
            <div className="grid grid-cols-4 gap-4">
              {genres.map((g, i) => (
                <button
                  key={g.name} onClick={() => setQ(g.name === "Pop" ? "Indie Pop" : g.name)}
                  className="animate-fade-up group relative h-36 overflow-hidden rounded-xl p-4 text-left transition-transform hover:scale-[1.03]"
                  style={{ animationDelay: `${i * 40}ms`, background: `linear-gradient(135deg, oklch(0.55 0.18 ${g.hue}), oklch(0.35 0.12 ${g.hue + 40}))` }}
                >
                  <span className="font-display text-2xl font-bold">{g.name}</span>
                  <img src={albums[i % 4]!.cover} alt="" className="absolute -bottom-2 -right-4 h-24 w-24 rotate-[25deg] rounded-md object-cover shadow-cover transition-transform duration-300 group-hover:rotate-[15deg] group-hover:scale-110" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
