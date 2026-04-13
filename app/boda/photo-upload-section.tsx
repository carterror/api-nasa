"use client";

import { FormEvent, useMemo, useState } from "react";

type UploadStatus = "idle" | "uploading" | "success" | "error";

interface UploadResponse {
	message?: string;
	uploaded?: Array<{ key: string; url?: string }>;
	error?: string;
}

interface PhotoUploadSectionProps {
	onUploadComplete?: () => void;
}

export default function PhotoUploadSection({ onUploadComplete }: PhotoUploadSectionProps) {
	const [files, setFiles] = useState<File[]>([]);
	const [status, setStatus] = useState<UploadStatus>("idle");
	const [feedback, setFeedback] = useState("");

	const totalSizeMb = useMemo(() => {
		const bytes = files.reduce((acc, file) => acc + file.size, 0);
		return (bytes / (1024 * 1024)).toFixed(1);
	}, [files]);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (files.length === 0) {
			setStatus("error");
			setFeedback("Selecciona al menos una foto antes de enviar.");
			return;
		}

		const formData = new FormData();
		for (const file of files) {
			formData.append("files", file);
		}

		setStatus("uploading");
		setFeedback("Subiendo tus recuerdos...");

		try {
			const response = await fetch("/api/wedding-photos", {
				method: "POST",
				body: formData,
			});

			const data: UploadResponse = await response.json();
			if (!response.ok) {
				throw new Error(data.error ?? "No se pudo subir las fotos.");
			}

			setStatus("success");
			setFeedback(data.message ?? "Fotos enviadas. Gracias por compartir este momento.");
			setFiles([]);
			onUploadComplete?.();
		} catch (error) {
			setStatus("error");
			setFeedback(
				error instanceof Error ? error.message : "Ocurrio un error al subir las fotos.",
			);
		}
	}

	return (
		<section className="rounded-3xl border border-[#F8DBDD]/80 bg-white/85 p-6 md:p-8">
			<div className="text-center">
				<p className="text-xs tracking-[0.25em] text-[#005a8e] uppercase">Album colaborativo</p>
				<h2 className="mt-2 text-3xl font-semibold text-[#00345B] md:text-4xl">
					Sube las fotos que tomes en nuestra boda
				</h2>
				<p className="mx-auto mt-3 max-w-2xl text-base text-[#004d7a] md:text-lg">
					Queremos ver cada sonrisa, cada abrazo y cada momento especial desde tu mirada.
				</p>
			</div>

			<form className="mt-6 space-y-4" onSubmit={handleSubmit}>
				<label
					htmlFor="wedding-photos"
					className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#F8DBDD] bg-[#fff5f6] px-4 py-8 text-center"
				>
					<span className="text-lg font-semibold text-[#00345B]">Seleccionar fotos</span>
					<span className="mt-2 text-sm text-[#004d7a]">
						PNG, JPG o HEIC. Maximo 10 fotos por envio.
					</span>
					<input
						id="wedding-photos"
						type="file"
						accept="image/*"
						multiple
						className="hidden"
						onChange={(event) => {
							const selectedFiles = Array.from(event.target.files ?? []).slice(0, 10);
							setFiles(selectedFiles);
							setStatus("idle");
							setFeedback("");
						}}
					/>
				</label>

				<div className="rounded-2xl bg-[#fff5f6] p-4 text-sm text-[#00345B]">
					<p>Fotos seleccionadas: {files.length}</p>
					<p>Peso aproximado: {totalSizeMb} MB</p>
				</div>

				<button
					type="submit"
					disabled={status === "uploading"}
					className="w-full rounded-xl bg-[#00345B] px-5 py-3 text-lg font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
				>
					{status === "uploading" ? "Subiendo..." : "Enviar fotos"}
				</button>
			</form>

			{feedback ? (
				<p
					className={`mt-4 text-center text-sm md:text-base ${
						status === "error" ? "text-[#9f2a3f]" : "text-[#004d7a]"
					}`}
				>
					{feedback}
				</p>
			) : null}
		</section>
	);
}
