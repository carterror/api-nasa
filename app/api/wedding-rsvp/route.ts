import { NextResponse } from "next/server";
import { Resend } from "resend";
import { collectRows, getQueryErrorMessage, runD1Query } from "../_lib/d1";
import { canonicalizeName } from "../../boda/invited-guests";


const resend = new Resend(process.env.RESEND_API_KEY ?? '');

interface CreateRsvpPayload {
    name?: string;
    email?: string;
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
        const email = typeof payload.email === "string" ? normalizeText(payload.email) : "";
        const attending = payload.attending;
        const guestsCount =
            typeof payload.guestsCount === "number" ? Math.floor(payload.guestsCount) : 0;
        const message =
            typeof payload.message === "string" ? normalizeText(payload.message).slice(0, 300) : "";

        if (!name) {
            return NextResponse.json({ error: "Debes enviar el nombre." }, { status: 400 });
        }

        if (!email || !/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email)) {
            return NextResponse.json({ error: "Debes enviar un correo valido." }, { status: 400 });
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

        await resend.emails.send({
            to: email,
            template: {
                id: 'wedding-confirmation',
                variables: {
                    event_time: '2:00 PM',
                    first_name: name.split(' ')[0],
                    venue_address: 'https://www.google.com/maps/place/La+Toscana+Garden/@-0.3016376,-78.4931584,136m/data=!3m1!1e3!4m6!3m5!1s0x91d5a3cb2d557cbb:0xdd6c78080b4f3e93!8m2!3d-0.3016197!4d-78.4932381!16s%2Fg%2F11yqzry56b?entry=ttu&g_ep=EgoyMDI2MDQxOS4wIKXMDSoASAFQAw%3D%3D',
                    venue_name: 'Quinta Ontaneda Lote 111 Conocoto, Quito',
                },
            },
        } as Parameters<typeof resend.emails.send>[0]);

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
