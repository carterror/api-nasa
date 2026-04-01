import Cloudflare from "cloudflare";

interface D1Config {
    accountId: string;
    databaseId: string;
}

interface D1QueryChunk {
    results?: Array<Record<string, unknown>>;
    success?: boolean;
    meta?: Record<string, unknown>;
    errors?: Array<{ message?: string }>;
}

function getD1Config(): D1Config {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;

    if (!accountId || !databaseId) {
        throw new Error(
            "Debes configurar CLOUDFLARE_ACCOUNT_ID y CLOUDFLARE_D1_DATABASE_ID.",
        );
    }

    return { accountId, databaseId };
}

function getClient(): Cloudflare {
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    if (!apiToken) {
        throw new Error("Debes configurar CLOUDFLARE_API_TOKEN.");
    }

    return new Cloudflare({ apiToken });
}

export async function runD1Query(sql: string, params: string[] = []): Promise<D1QueryChunk[]> {
    const { accountId, databaseId } = getD1Config();
    const client = getClient();
    const chunks: D1QueryChunk[] = [];

    for await (const queryResult of client.d1.database.query(databaseId, {
        account_id: accountId,
        sql,
        params,
    })) {
        chunks.push(queryResult as D1QueryChunk);
    }

    return chunks;
}

export function collectRows(chunks: D1QueryChunk[]): Array<Record<string, unknown>> {
    const rows: Array<Record<string, unknown>> = [];

    for (const chunk of chunks) {
        if (chunk.results) {
            rows.push(...chunk.results);
        }
    }

    return rows;
}

export function getQueryErrorMessage(chunks: D1QueryChunk[]): string | null {
    for (const chunk of chunks) {
        if (Array.isArray(chunk.errors) && chunk.errors.length > 0) {
            return chunk.errors[0]?.message ?? "Error al ejecutar consulta en D1.";
        }
        if (chunk.success === false) {
            return "La consulta en D1 no se ejecuto correctamente.";
        }
    }

    return null;
}
