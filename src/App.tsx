import "./index.css";
import vocabulary from "./data/vocabulary.json";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Moon,
  Search,
  Shuffle,
  Sparkles,
  Sun,
  Volume2,
  X,
} from "lucide-react";

type Word = {
  id: number;
  english: string;
  indonesian: string;
};

type Theme = "light" | "dark";

const accents = [
  "bg-[color-mix(in_srgb,var(--accent) 14%,transparent)]",
  "bg-[color-mix(in_srgb,#06b6d4 14%,transparent)]",
  "bg-[color-mix(in_srgb,#8b5cf6 14%,transparent)]",
  "bg-[color-mix(in_srgb,#f59e0b 16%,transparent)]",
  "bg-[color-mix(in_srgb,#22c55e 14%,transparent)]",
];

const normalize = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .toLowerCase();

const shuffle = (list: Word[]) => {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
};

const phonemeRules: Array<[RegExp, string]> = [
  [/tion\b/g, "ʃən"],
  [/sion\b/g, "ʒən"],
  [/ough/g, "ʌf"],
  [/augh/g, "ɔː"],
  [/igh/g, "aɪ"],
  [/ph/g, "f"],
  [/ch/g, "tʃ"],
  [/sh/g, "ʃ"],
  [/th/g, "θ"],
  [/oo/g, "uː"],
  [/ee/g, "iː"],
  [/ea/g, "iː"],
  [/ai/g, "eɪ"],
  [/ay/g, "eɪ"],
  [/oa/g, "oʊ"],
  [/ie/g, "aɪ"],
  [/ou/g, "aʊ"],
  [/ow/g, "oʊ"],
  [/er\b/g, "ɚ"],
  [/ar/g, "ɑːr"],
  [/or/g, "ɔːr"],
  [/ir/g, "ɜr"],
  [/ur/g, "ɜr"],
  [/al/g, "ɔːl"],
  [/qu/g, "kw"],
];

const letterToIpa: Record<string, string> = {
  a: "æ",
  b: "b",
  c: "k",
  d: "d",
  e: "ɛ",
  f: "f",
  g: "g",
  h: "h",
  i: "ɪ",
  j: "ʤ",
  k: "k",
  l: "l",
  m: "m",
  n: "n",
  o: "ɒ",
  p: "p",
  q: "k",
  r: "ɹ",
  s: "s",
  t: "t",
  u: "ʌ",
  v: "v",
  w: "w",
  x: "ks",
  y: "i",
  z: "z",
};

const toPhonemeHint = (word: string) => {
  let value = word.toLowerCase();
  phonemeRules.forEach(([pattern, ipa]) => {
    value = value.replace(pattern, ipa);
  });
  value = value.replace(/[a-z]/g, letter => letterToIpa[letter] ?? letter);
  return value;
};

const formatPronunciation = (text: string) => {
  if (!text) return "";
  const hint = text
    .split(/\s+/)
    .map(piece => toPhonemeHint(piece))
    .join(" · ");
  return `/${hint}/`;
};

type FlashcardProps = {
  word: Word;
  onSpeakEnglish: (text: string) => void;
  onSpeakIndonesian: (text: string) => void;
};

const Flashcard = ({ word, onSpeakEnglish, onSpeakIndonesian }: FlashcardProps) => {
  const accent = accents[word.id % accents.length];

  return (
    <div className="group relative w-full max-w-xl">
      <div className="absolute inset-0 rounded-3xl bg-(--glow-soft) blur-2xl" aria-hidden />
      <div className="relative overflow-hidden rounded-3xl border border-(--border) bg-(--card) p-8 shadow-(--shadow) transition duration-300">
        <div className={`absolute inset-0 ${accent} opacity-0 transition duration-500 group-hover:opacity-100`} aria-hidden />
        <div className="relative z-10 flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-(--muted)">
            <span>English</span>
            <span className="rounded-full bg-(--pill) px-3 py-1 font-semibold text-[11px] text-(--text-strong)">
              #{word.id.toString().padStart(4, "0")}
            </span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <p className="text-3xl font-semibold leading-tight text-(--text-strong) sm:text-4xl">
              {word.english}
            </p>
            <button
              type="button"
              onClick={() => onSpeakEnglish(word.english)}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-(--pill) px-3 text-sm font-semibold text-(--text-strong) transition hover:-translate-y-0.5 cursor-pointer"
              aria-label="Play English pronunciation"
            >
              <Volume2 className="h-4 w-4" />
              <span className="hidden sm:inline">Pronounce</span>
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-(--muted)">
            <span className="font-semibold text-(--text-strong)">Pronunciation</span>
            <Volume2 className="h-4 w-4 text-(--text)" />
            <span className="font-mono text-(--text)">{formatPronunciation(word.english)}</span>
          </div>
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-(--muted)">Bahasa Indonesia</div>
          <div className="flex items-start justify-between gap-3">
            <p className="text-xl text-(--text) sm:text-2xl">{word.indonesian}</p>
            <button
              type="button"
              onClick={() => onSpeakIndonesian(word.indonesian)}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-(--pill) px-3 text-sm font-semibold text-(--text-strong) transition hover:-translate-y-0.5 cursor-pointer"
              aria-label="Play Indonesian pronunciation"
            >
              <Volume2 className="h-4 w-4" />
              <span className="hidden sm:inline">Pronounce</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function App() {
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<"alpha" | "shuffle">("alpha");
  const [theme, setTheme] = useState<Theme>("light");
  const [currentIndex, setCurrentIndex] = useState(0);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const clickRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-light", "theme-dark");
    root.classList.add(theme === "dark" ? "theme-dark" : "theme-light");
  }, [theme]);

  useEffect(() => {
    const setVoice = () => {
      const voices = window.speechSynthesis?.getVoices?.() ?? [];
      const american = voices.find(v => v.lang?.toLowerCase().startsWith("en-us"));
      voiceRef.current = american ?? voices[0] ?? null;
    };
    setVoice();
    if (typeof window !== "undefined") {
      window.speechSynthesis?.addEventListener("voiceschanged", setVoice);
      return () => window.speechSynthesis?.removeEventListener("voiceschanged", setVoice);
    }
    return undefined;
  }, []);

  useEffect(() => {
    clickRef.current = new Audio(
      "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="
    );
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return vocabulary;
    return vocabulary.filter(word => {
      const english = normalize(word.english);
      const indonesian = normalize(word.indonesian);
      return english.includes(q) || indonesian.includes(q);
    });
  }, [query]);

  const ordered = useMemo(() => {
    if (sortMode === "shuffle") return shuffle(filtered);
    return [...filtered].sort((a, b) => a.english.localeCompare(b.english, "en", { sensitivity: "base" }));
  }, [filtered, sortMode]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [query, sortMode]);

  const currentWord = ordered[currentIndex] ?? null;
  const total = vocabulary.length;

  const speak = (text: string, lang: string) => {
    if (!text || typeof window === "undefined" || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    if (voiceRef.current && voiceRef.current.lang.toLowerCase().startsWith("en-us")) {
      utterance.voice = voiceRef.current;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const playClick = () => {
    const audio = clickRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => { });
  };

  const goNext = () => {
    if (ordered.length === 0) return;
    playClick();
    setCurrentIndex(index => (index + 1) % ordered.length);
  };

  const goPrev = () => {
    if (ordered.length === 0) return;
    playClick();
    setCurrentIndex(index => (index - 1 + ordered.length) % ordered.length);
  };

  const goShuffle = () => {
    if (ordered.length === 0) return;
    playClick();
    setCurrentIndex(Math.floor(Math.random() * ordered.length));
  };

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  return (
    <div className={`app-shell relative min-h-screen overflow-hidden ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(59,130,246,0.08),transparent_32%),radial-gradient(circle_at_78%_12%,rgba(16,185,129,0.05),transparent_28%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center px-4 pb-28 pt-8 sm:px-6">
        <header className="mb-4 flex w-full items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-(--pill) px-3 py-1 text-xs font-semibold text-(--text-strong)">
              GSL • 2,000 words
            </span>
            <span className="hidden text-sm text-(--muted) sm:inline">
              Core deck for everyday speaking, listening, and reading.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setTheme(mode => (mode === "light" ? "dark" : "light"))}
            className="glass-card flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-(--text-strong) transition hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="hidden sm:inline">{theme === "light" ? "Light" : "Dark"} mode</span>
          </button>
        </header>

        <main className="flex w-full flex-1 flex-col items-center gap-5">
          <div className="glass-card flex w-full flex-col gap-3 rounded-2xl px-4 py-3 sm:flex-row sm:items-center sm:px-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-(--pill) text-lg">
                <Search className="h-5 w-5 text-(--text-strong)" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--muted)">Cari kata</p>
                <p className="text-sm text-(--text-strong)">Search English or Bahasa Indonesia</p>
              </div>
            </div>
            <div className="flex flex-1 items-center gap-2">
              <input
                type="text"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="E.g. learn, speak, happy..."
                className="w-full rounded-xl border border-transparent bg-(--input) px-3 py-2 text-base text-(--text) placeholder:text-(--muted) outline-none transition focus:border-(--accent)"
                autoComplete="off"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="inline-flex items-center gap-2 rounded-full bg-(--pill) px-3 py-2 text-sm font-semibold text-(--text-strong) transition hover:-translate-y-0.5 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                  Reset
                </button>
              ) : null}
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center justify-between gap-3 text-sm text-(--muted)">
            <div className="glass-card flex items-center gap-2 rounded-full px-3 py-2">
              <span className="h-2 w-2 rounded-full bg-(--accent)" />
              <span>{ordered.length.toLocaleString()} cards match</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSortMode("alpha")}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition cursor-pointer ${sortMode === "alpha"
                  ? "bg-(--accent-soft) text-(--text-strong) shadow-md"
                  : "text-(--text) hover:bg-(--pill)"
                  }`}
              >
                A → Z
              </button>
              <button
                type="button"
                onClick={() => setSortMode("shuffle")}
                className={`rounded-full px-3 py-2 text-sm font-semibold transition cursor-pointer ${sortMode === "shuffle"
                  ? "bg-(--accent-soft) text-(--text-strong) shadow-md"
                  : "text-(--text) hover:bg-(--pill)"
                  }`}
              >
                Shuffle
              </button>
            </div>
          </div>

          <div className="flex w-full flex-1 items-center justify-center">
            {currentWord ? (
              <Flashcard
                word={currentWord}
                onSpeakEnglish={text => speak(text, "en-US")}
                onSpeakIndonesian={text => speak(text, "id-ID")}
              />
            ) : (
              <div className="glass-card w-full max-w-xl rounded-3xl p-8 text-center">
                <p className="text-lg font-semibold text-(--text-strong)">No matches found</p>
                <p className="text-sm text-(--muted)">Try another keyword or reset the search.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <nav className="fixed bottom-6 left-1/2 z-20 w-[min(520px,calc(100%-2rem))] -translate-x-1/2">
        <div className="floating-bar grid grid-cols-5 items-center gap-1.5 rounded-2xl px-2.5 py-2 shadow-(--shadow) backdrop-blur-xl">
          {[
            { label: "Deck", icon: <BookOpen className="h-5 w-5" />, onClick: () => setCurrentIndex(0) },
            { label: "Prev", icon: <ArrowLeft className="h-5 w-5" />, onClick: goPrev },
            { label: "Shuffle", icon: <Sparkles className="h-5 w-5" />, onClick: goShuffle },
            { label: "Next", icon: <ArrowRight className="h-5 w-5" />, onClick: goNext },
            {
              label: theme === "light" ? "Dark" : "Light",
              icon: theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />,
              onClick: () => setTheme(mode => (mode === "light" ? "dark" : "light")),
            },
          ].map(item => (
            <button
              key={item.label}
              type="button"
              onClick={item.onClick}
              className="group flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-xs font-semibold text-(--text-strong) transition duration-200 hover:-translate-y-1 hover:bg-(--pill) cursor-pointer"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--accent) 10%,transparent)] text-(--text-strong) shadow-sm transition group-hover:shadow">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default App;
