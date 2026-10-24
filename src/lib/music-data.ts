import c1 from "@/assets/cover1.jpg";
import c2 from "@/assets/cover2.jpg";
import c3 from "@/assets/cover3.jpg";
import c4 from "@/assets/cover4.jpg";

export type Album = { id: string; title: string; artist: string; cover: string; year: number; genre: string };
export type Track = { id: number; title: string; albumId: string; duration: number };

export const albums: Album[] = [
  { id: "sol-poente", title: "Sol Poente", artist: "Solenne", cover: c1, year: 2026, genre: "Indie Pop" },
  { id: "cidade-eletrica", title: "Cidade Elétrica", artist: "Midnight Avenue", cover: c2, year: 2025, genre: "Synthwave" },
  { id: "azul-profundo", title: "Azul Profundo", artist: "Marée", cover: c3, year: 2026, genre: "Ambient" },
  { id: "horizonte", title: "Horizonte", artist: "Dunas", cover: c4, year: 2024, genre: "Eletrônica" },
];

const names: Record<string, string[]> = {
  "sol-poente": ["Golden Hour", "Ember", "Verão Sem Fim", "Laranja"],
  "cidade-eletrica": ["Neon Rain", "Afterglow", "Avenida 3AM", "Pulse"],
  "azul-profundo": ["Tide", "Saltwater", "Maré Alta", "Coral"],
  "horizonte": ["Mirage", "Wanderer", "Areia", "Oásis"],
};

export const tracks: Track[] = albums.flatMap((a, ai) =>
  names[a.id]!.map((title, i) => ({ id: ai * 10 + i, title, albumId: a.id, duration: 170 + ((ai * 37 + i * 23) % 90) })),
);

export const albumOf = (t: Track) => albums.find((a) => a.id === t.albumId)!;
export const tracksOf = (albumId: string) => tracks.filter((t) => t.albumId === albumId);

export const playlists = [
  { name: "Favoritas", cover: c1, count: 48 },
  { name: "Foco Profundo", cover: c3, count: 32 },
  { name: "Noite de Chuva", cover: c2, count: 27 },
  { name: "Road Trip", cover: c4, count: 61 },
];

export const genres = [
  { name: "Pop", hue: 18 }, { name: "Synthwave", hue: 330 }, { name: "Ambient", hue: 220 },
  { name: "Eletrônica", hue: 60 }, { name: "MPB", hue: 140 }, { name: "Jazz", hue: 280 },
  { name: "Rock", hue: 0 }, { name: "Lo-fi", hue: 190 },
];

export const stations = [
  { name: "Aura Hits", desc: "Os maiores sucessos agora", album: albums[0]! },
  { name: "Noite Neon", desc: "Synth para dirigir à noite", album: albums[1]! },
  { name: "Calmaria", desc: "Sons para relaxar", album: albums[2]! },
  { name: "Pôr do Sol", desc: "Eletrônica ao entardecer", album: albums[3]! },
];

export const lyrics = [
  "Quando a luz começa a cair", "E o céu se pinta de ouro", "Eu fecho os olhos e sinto",
  "Que o mundo inteiro é nosso", "Deixa o tempo desacelerar", "Nessa hora dourada",
  "Nada mais precisa ser dito", "Só a música e a estrada", "Quando a luz começa a cair",
  "E o céu se pinta de ouro",
];

export const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
