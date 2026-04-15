import { nanoid } from 'nanoid'
import { NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js'


const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;
const MAX_FILES = 10;

function getSupabaseConfig(): { url: string; key: string; bucket: string } {
	const url = process.env.SUPABASE_URL;
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
	const bucket = process.env.SUPABASE_STORAGE_BUCKET;

	if (!url || !key || !bucket) {
		throw new Error(
			"Debes configurar SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY y SUPABASE_STORAGE_BUCKET.",
		);
	}

	return { url, key, bucket };
}

function sanitizeFileName(fileName: string): string {
	return fileName
		.toLowerCase()
		.replace(/[^a-z0-9.-]/g, "-")
		.replace(/-+/g, "-");
}

function getSupaClient() {
	const { url, key } = getSupabaseConfig();
	return createClient(url, key);
}

export async function GET() {
	try {
		const { bucket, url } = getSupabaseConfig();
		const client = getSupaClient();
		const { data, error } = await client.storage.from(bucket).listV2({ limit: 10 })
		console.log({data, error});
		
		return NextResponse.json({ photos: data?.objects.map((obj) => ({ key: obj.name, lastModified: obj.updated_at, url: `${url}/storage/v1/object/public/${bucket}/${obj.name}` })), error });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Error interno al listar fotos.";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const { bucket, url } = getSupabaseConfig();

		const formData = await request.formData();
		const files = formData
			.getAll("files")
			.filter((entry): entry is File => entry instanceof File);

		if (files.length === 0) {
			return NextResponse.json({ error: "No se recibieron archivos." }, { status: 400 });
		}

		if (files.length > MAX_FILES) {
			return NextResponse.json(
				{ error: `Solo puedes subir hasta ${MAX_FILES} fotos por envio.` },
				{ status: 400 },
			);
		}

		const client = getSupaClient();
		const uploaded: Array<{ key: string; url?: string }> = [];

		for (const file of files) {
			if (!file.type.startsWith("image/")) {
				return NextResponse.json(
					{ error: "Solo se permiten imagenes." },
					{ status: 400 },
				);
			}

			if (file.size > MAX_FILE_SIZE_BYTES) {
				return NextResponse.json(
					{ error: "Cada foto debe pesar maximo 15 MB." },
					{ status: 400 },
				);
			}

			const extension = file.name.includes(".")
				? file.name.slice(file.name.lastIndexOf("."))
				: ".png";
			const key = `${nanoid()}-${sanitizeFileName(file.name.replace(extension, ""))}${extension}`;
			const body = Buffer.from(await file.arrayBuffer());

			const { data, error } = await client.storage.from(bucket)
			.upload(key, body, {
				cacheControl: '3600',
				upsert: false,
				contentType: file.type,
			})

			console.log({data,error});
			

			uploaded.push({
				key,
				url: `${url}/storage/v1/object/public/${bucket}/${key}`,
			});
		}

		return NextResponse.json({
			message: "Tus fotos fueron cargadas correctamente. Gracias por compartir este dia.",
			uploaded,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "Error interno al subir fotos.";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}
