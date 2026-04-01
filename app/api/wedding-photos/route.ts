import {
	ListObjectsV2Command,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;
const MAX_FILES = 10;

function getBucketName(): string | undefined {
	return process.env.AWS_S3_BUCKET ?? process.env.S3_BUCKET ?? process.env.R2_BUCKET_NAME;
}

function sanitizeFileName(fileName: string): string {
	return fileName
		.toLowerCase()
		.replace(/[^a-z0-9.-]/g, "-")
		.replace(/-+/g, "-");
}

function getS3Client(): S3Client {
	const accountId = process.env.R2_ACCOUNT_ID;
	const endpoint =
		process.env.S3_ENDPOINT_URL ??
		process.env.R2_ENDPOINT_URL ??
		(accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);
	const region = process.env.AWS_REGION ?? process.env.S3_REGION ?? "auto";

	const accessKeyId = process.env.AWS_ACCESS_KEY_ID ?? process.env.R2_ACCESS_KEY_ID;
	const secretAccessKey =
		process.env.AWS_SECRET_ACCESS_KEY ?? process.env.R2_SECRET_ACCESS_KEY;

	if ((accessKeyId && !secretAccessKey) || (!accessKeyId && secretAccessKey)) {
		throw new Error("Debes configurar ambas credenciales: ACCESS_KEY y SECRET_ACCESS_KEY.");
	}

	return new S3Client({
		region,
		endpoint,
		credentials: accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined,
	});
}

function getMissingConfigResponse() {
	return NextResponse.json(
		{
			error:
				"Carga no disponible. Configura bucket y credenciales S3/R2 en variables de entorno.",
		},
		{ status: 500 },
	);
}

export async function GET() {
	try {
		const bucket = getBucketName();
		if (!bucket) {
			return getMissingConfigResponse();
		}

		const client = getS3Client();
		const publicBaseUrl = process.env.AWS_S3_PUBLIC_BASE_URL;
		const result = await client.send(
			new ListObjectsV2Command({
				Bucket: bucket,
				Prefix: "wedding-photos/",
				MaxKeys: 120,
			}),
		);

		const photos = (result.Contents ?? [])
			.filter((item) => Boolean(item.Key))
			.sort((a, b) => {
				const left = a.LastModified?.getTime() ?? 0;
				const right = b.LastModified?.getTime() ?? 0;
				return right - left;
			})
			.map((item) => {
				const key = item.Key as string;
				return {
					key,
					url: publicBaseUrl ? `${publicBaseUrl.replace(/\/$/, "")}/${key}` : undefined,
					lastModified: item.LastModified?.toISOString() ?? null,
				};
			});

		return NextResponse.json({ photos });
	} catch (error) {
		const message = error instanceof Error ? error.message : "Error interno al listar fotos.";
		return NextResponse.json({ error: message }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		const bucket = getBucketName();
		if (!bucket) {
			return getMissingConfigResponse();
		}

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

		const client = getS3Client();
		const publicBaseUrl = process.env.AWS_S3_PUBLIC_BASE_URL;
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
				: ".jpg";
			const key = `wedding-photos/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${sanitizeFileName(file.name.replace(extension, ""))}${extension}`;
			const body = Buffer.from(await file.arrayBuffer());

			await client.send(
				new PutObjectCommand({
					Bucket: bucket,
					Key: key,
					Body: body,
					ContentType: file.type,
				}),
			);

			uploaded.push({
				key,
				url: publicBaseUrl ? `${publicBaseUrl.replace(/\/$/, "")}/${key}` : undefined,
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
