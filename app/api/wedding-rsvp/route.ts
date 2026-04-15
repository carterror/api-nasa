import { NextResponse } from "next/server";
import { collectRows, getQueryErrorMessage, runD1Query } from "../_lib/d1";
import { canonicalizeName } from "../../boda/invited-guests";

interface CreateRsvpPayload {
    name?: string;
    attending?: boolean;
    guestsCount?: number;
    message?: string;
}

function normalizeText(value: string): string {
    return value.trim().replace(/\s+/g, " ");
}

export async function GET() {
    try {
        const chunks = await runD1Query(
            "SELECT id, name, attending, guests_count, message, created_at FROM wedding_rsvp ORDER BY datetime(created_at) DESC LIMIT 200;",
        );
        const queryError = getQueryErrorMessage(chunks);
        if (queryError) {
            return NextResponse.json({ error: queryError }, { status: 500 });
        }

        const confirmations = collectRows(chunks).map((row) => ({
            id: row.id,
            name: row.name,
            attending: Number(row.attending) === 1,
            guestsCount: Number(row.guests_count ?? 0),
            message: row.message,
            createdAt: row.created_at,
        }));

        return NextResponse.json({ confirmations });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Error interno al obtener confirmaciones.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {

        const payload = (await request.json()) as CreateRsvpPayload;
        const name = typeof payload.name === "string" ? normalizeText(payload.name) : "";
        const attending = payload.attending;
        const guestsCount =
            typeof payload.guestsCount === "number" ? Math.floor(payload.guestsCount) : 0;
        const message =
            typeof payload.message === "string" ? normalizeText(payload.message).slice(0, 300) : "";

        if (!name) {
            return NextResponse.json({ error: "Debes enviar el nombre." }, { status: 400 });
        }

        if (typeof attending !== "boolean") {
            return NextResponse.json(
                { error: "Debes indicar si asistira o no." },
                { status: 400 },
            );
        }

        if (name.length > 80) {
            return NextResponse.json(
                { error: "El nombre no puede superar 80 caracteres." },
                { status: 400 },
            );
        }

        if (guestsCount < 0 || guestsCount > 10) {
            return NextResponse.json(
                { error: "El numero de acompanantes debe estar entre 0 y 10." },
                { status: 400 },
            );
        }

        const chunks = await runD1Query(
            "INSERT INTO wedding_rsvp (name, attending, guests_count, message, created_at) VALUES (?, ?, ?, ?, datetime('now'));",
            [name, attending ? "1" : "0", String(guestsCount), message],
        );
        const queryError = getQueryErrorMessage(chunks);
        if (queryError) {
            return NextResponse.json({ error: queryError }, { status: 500 });
        }

        return NextResponse.json({
            message: "Confirmacion registrada correctamente.",
        });
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Error interno al registrar confirmacion.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
