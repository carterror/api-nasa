import { NextResponse } from "next/server";
import { collectRows, getQueryErrorMessage, runD1Query } from "../_lib/d1";
import { canonicalizeName, getInvitedGuests } from "../../boda/invited-guests";

interface CreateCommentPayload {
    name?: string;
    comment?: string;
}

function normalizeText(value: string): string {
    return value.trim().replace(/\s+/g, " ");
}

export async function GET() {
    try {
        const invitedGuests = getInvitedGuests();
        const chunks = await runD1Query(
            "SELECT id, name, comment, created_at FROM wedding_comments ORDER BY datetime(created_at) DESC LIMIT 100;",
        );
        const queryError = getQueryErrorMessage(chunks);
        if (queryError) {
            return NextResponse.json({ error: queryError }, { status: 500 });
        }

        const comments = collectRows(chunks).map((row) => ({
            id: row.id,
            name: row.name,
            comment: row.comment,
            createdAt: row.created_at,
        }));

        return NextResponse.json({ comments, invitedGuests });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Error interno al obtener comentarios.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const invitedGuests = getInvitedGuests();
        const invitedGuestSet = new Set(invitedGuests.map((guest) => canonicalizeName(guest)));

        const payload = (await request.json()) as CreateCommentPayload;
        const name = typeof payload.name === "string" ? normalizeText(payload.name) : "";
        const comment = typeof payload.comment === "string" ? normalizeText(payload.comment) : "";

        if (!name || !comment) {
            return NextResponse.json(
                { error: "Debes enviar nombre y comentario." },
                { status: 400 },
            );
        }

        if (name.length > 80) {
            return NextResponse.json(
                { error: "El nombre no puede superar 80 caracteres." },
                { status: 400 },
            );
        }

        if (invitedGuestSet.size === 0) {
            return NextResponse.json(
                { error: "No hay invitados configurados para dejar comentarios." },
                { status: 500 },
            );
        }

        if (!invitedGuestSet.has(canonicalizeName(name))) {
            return NextResponse.json(
                { error: "Tu nombre no esta en la lista de invitados habilitados." },
                { status: 403 },
            );
        }

        if (comment.length > 500) {
            return NextResponse.json(
                { error: "El comentario no puede superar 500 caracteres." },
                { status: 400 },
            );
        }

        const chunks = await runD1Query(
            "INSERT INTO wedding_comments (name, comment, created_at) VALUES (?, ?, datetime('now'));",
            [name, comment],
        );

        const queryError = getQueryErrorMessage(chunks);
        if (queryError) {
            return NextResponse.json({ error: queryError }, { status: 500 });
        }

        return NextResponse.json({
            message: "Comentario guardado correctamente.",
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Error interno al guardar comentario.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
