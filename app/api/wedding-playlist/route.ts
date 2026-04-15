import { NextResponse } from "next/server";
import { collectRows, getQueryErrorMessage, runD1Query } from "../_lib/d1";
import { canonicalizeName } from "../../boda/invited-guests";

interface CreatePlaylistPayload {
    name?: string;
    song?: string;
    artist?: string;
}

function normalizeText(value: string): string {
    return value.trim().replace(/\s+/g, " ");
}

export async function GET() {
    try {
        const chunks = await runD1Query(
            "SELECT id, name, song, artist, created_at FROM wedding_playlist ORDER BY datetime(created_at) DESC LIMIT 200;",
        );
        const queryError = getQueryErrorMessage(chunks);
        if (queryError) {
            return NextResponse.json({ error: queryError }, { status: 500 });
        }

        const songs = collectRows(chunks).map((row) => ({
            id: row.id,
            name: row.name,
            song: row.song,
            artist: row.artist,
            createdAt: row.created_at,
        }));

        return NextResponse.json({ songs });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Error interno al obtener la playlist.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
 
        const payload = (await request.json()) as CreatePlaylistPayload;
        const name = typeof payload.name === "string" ? normalizeText(payload.name) : "";
        const song = typeof payload.song === "string" ? normalizeText(payload.song) : "";
        const artist = typeof payload.artist === "string" ? normalizeText(payload.artist) : "";

        if (!name || !song) {
            return NextResponse.json(
                { error: "Debes enviar tu nombre y el nombre de la canción." },
                { status: 400 },
            );
        }

        if (name.length > 80) {
            return NextResponse.json(
                { error: "El nombre no puede superar 80 caracteres." },
                { status: 400 },
            );
        }

        if (song.length > 150) {
            return NextResponse.json(
                { error: "El nombre de la canción no puede superar 150 caracteres." },
                { status: 400 },
            );
        }

        if (artist.length > 100) {
            return NextResponse.json(
                { error: "El nombre del artista no puede superar 100 caracteres." },
                { status: 400 },
            );
        }

        const chunks = await runD1Query(
            "INSERT INTO wedding_playlist (name, song, artist, created_at) VALUES (?, ?, ?, datetime('now'));",
            [name, song, artist || ""],
        );

        const queryError = getQueryErrorMessage(chunks);
        if (queryError) {
            return NextResponse.json({ error: queryError }, { status: 500 });
        }

        return NextResponse.json({
            message: "¡Canción añadida a la playlist!",
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Error interno al guardar la canción.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
