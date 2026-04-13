"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

interface Song {
    id: unknown;
    name: string;
    song: string;
    artist: string;
    createdAt: unknown;
}

export default function PlaylistModal() {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState<"add" | "view">("add");
    const [name, setName] = useState("Anónimo");
    const [song, setSong] = useState("");
    const [artist, setArtist] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [songs, setSongs] = useState<Song[]>([]);
    const [loadingList, setLoadingList] = useState(false);

    async function fetchSongs() {
        setLoadingList(true);
        try {
            const res = await fetch("/api/wedding-playlist");
            const data = (await res.json()) as { songs?: Song[]; error?: string };
            if (data.songs) setSongs(data.songs);
        } catch {
            // silently fail
        } finally {
            setLoadingList(false);
        }
    }

    function handleOpen() {
        setOpen(true);
        setTab("add");
        setStatus("idle");
        setMessage("");
    }

    function handleClose() {
        setOpen(false);
        setName("");
        setSong("");
        setArtist("");
        setStatus("idle");
        setMessage("");
        setSongs([]);
    }

    function handleTabChange(next: "add" | "view") {
        setTab(next);
        if (next === "view") fetchSongs();
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("loading");
        setMessage("");
        try {
            const res = await fetch("/api/wedding-playlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, song, artist }),
            });
            const data = (await res.json()) as { message?: string; error?: string };
            if (res.ok) {
                setStatus("success");
                setMessage(data.message ?? "¡Canción añadida!");
                setName("");
                setSong("");
                setArtist("");
            } else {
                setStatus("error");
                setMessage(data.error ?? "Error al guardar la canción.");
            }
        } catch {
            setStatus("error");
            setMessage("Error de conexión. Intenta de nuevo.");
        }
    }

    return (
        <>
            <button
                onClick={handleOpen}
                className="mt-5 inline-block rounded-xl bg-[#00345B] px-6 py-3 text-lg font-semibold text-white transition hover:brightness-110"
            >
                🎵 Sugerir canción
            </button>

            {open && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
                >
                    <div className="relative w-full max-w-md rounded-3xl border border-[#F8DBDD]/80 bg-white p-6 shadow-2xl md:p-8">
                        <button
                            onClick={handleClose}
                            aria-label="Cerrar"
                            className="absolute top-4 right-4 text-2xl text-[#005a8e] hover:text-[#00345B]"
                        >
                            ✕
                        </button>

                        <p className="text-xs tracking-[0.25em] text-[#005a8e] uppercase">Playlist</p>
                        <h2 className="mt-1 text-2xl font-semibold text-[#00345B] md:text-3xl">
                            La que no puede faltar
                        </h2>

                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={() => handleTabChange("add")}
                                className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${
                                    tab === "add"
                                        ? "bg-[#00345B] text-white"
                                        : "bg-[#fff5f6] text-[#005a8e] hover:bg-[#F8DBDD]/60"
                                }`}
                            >
                                Sugerir
                            </button>
                            <button
                                onClick={() => handleTabChange("view")}
                                className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${
                                    tab === "view"
                                        ? "bg-[#00345B] text-white"
                                        : "bg-[#fff5f6] text-[#005a8e] hover:bg-[#F8DBDD]/60"
                                }`}
                            >
                                Ver lista
                            </button>
                        </div>

                        {tab === "add" && (
                            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
                                <div>
                                    <label className="mb-1 block text-xs font-semibold tracking-wide text-[#005a8e] uppercase">
                                        Tu nombre
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        maxLength={80}
                                        required
                                        placeholder="Como apareces en la invitación"
                                        className="w-full rounded-xl border border-[#F8DBDD] bg-[#fff5f6] px-4 py-2 text-base text-[#00345B] outline-none focus:border-[#005a8e] focus:ring-2 focus:ring-[#005a8e]/20"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold tracking-wide text-[#005a8e] uppercase">
                                        Canción
                                    </label>
                                    <input
                                        type="text"
                                        value={song}
                                        onChange={(e) => setSong(e.target.value)}
                                        maxLength={150}
                                        required
                                        placeholder="Nombre de la canción"
                                        className="w-full rounded-xl border border-[#F8DBDD] bg-[#fff5f6] px-4 py-2 text-base text-[#00345B] outline-none focus:border-[#005a8e] focus:ring-2 focus:ring-[#005a8e]/20"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-xs font-semibold tracking-wide text-[#005a8e] uppercase">
                                        Artista <span className="normal-case font-normal text-[#004d7a]">(opcional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={artist}
                                        onChange={(e) => setArtist(e.target.value)}
                                        maxLength={100}
                                        placeholder="Nombre del artista o banda"
                                        className="w-full rounded-xl border border-[#F8DBDD] bg-[#fff5f6] px-4 py-2 text-base text-[#00345B] outline-none focus:border-[#005a8e] focus:ring-2 focus:ring-[#005a8e]/20"
                                    />
                                </div>

                                {message && (
                                    <p
                                        className={`rounded-xl px-4 py-2 text-sm ${
                                            status === "success"
                                                ? "bg-green-50 text-green-700"
                                                : "bg-red-50 text-red-600"
                                        }`}
                                    >
                                        {message}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="rounded-xl bg-[#00345B] py-3 text-base font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
                                >
                                    {status === "loading" ? "Guardando…" : "Añadir a la playlist"}
                                </button>
                            </form>
                        )}

                        {tab === "view" && (
                            <div className="mt-5">
                                {loadingList ? (
                                    <p className="text-center text-sm text-[#004d7a]">Cargando playlist…</p>
                                ) : songs.length === 0 ? (
                                    <p className="text-center text-sm text-[#004d7a]">
                                        Aún no hay canciones sugeridas. ¡Sé el primero!
                                    </p>
                                ) : (
                                    <ul className="flex max-h-72 flex-col gap-3 overflow-y-auto pr-1">
                                        {songs.map((s, i) => (
                                            <li
                                                key={String(s.id)}
                                                className="rounded-2xl border border-[#F8DBDD]/80 bg-[#fff5f6] px-4 py-3 text-left"
                                            >
                                                <p className="text-xs text-[#005a8e]">#{i + 1} · sugerida por <span className="font-semibold">{s.name}</span></p>
                                                <p className="mt-1 text-base font-semibold text-[#00345B]">🎵 {s.song}</p>
                                                {s.artist && (
                                                    <p className="text-sm text-[#004d7a]">{s.artist}</p>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            , document.body)}
        </>
    );
}
