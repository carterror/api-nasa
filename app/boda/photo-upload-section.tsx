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
		<section className="rounded-3xl border border-[#c9a7ea]/70 bg-white/80 p-6 md:p-8">
			<div className="text-center">
				<p className="text-xs tracking-[0.25em] text-[#8a4ca1] uppercase">Album colaborativo</p>
				<h2 className="mt-2 text-3xl font-semibold text-[#4f2d84] md:text-4xl">
					Sube las fotos que tomes en nuestra boda
				</h2>
				<p className="mx-auto mt-3 max-w-2xl text-base text-[#4a3a6c] md:text-lg">
					Queremos ver cada sonrisa, cada abrazo y cada momento especial desde tu mirada.
				</p>
			</div>

			<form className="mt-6 space-y-4" onSubmit={handleSubmit}>
				<label
					htmlFor="wedding-photos"
					className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#b785de] bg-[#faf5ff] px-4 py-8 text-center"
				>
					<span className="text-lg font-semibold text-[#5b3498]">Seleccionar fotos</span>
					<span className="mt-2 text-sm text-[#6e54a2]">
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

				<div className="rounded-2xl bg-[#f7efff] p-4 text-sm text-[#4b2f76]">
					<p>Fotos seleccionadas: {files.length}</p>
					<p>Peso aproximado: {totalSizeMb} MB</p>
				</div>

				<button
					type="submit"
					disabled={status === "uploading"}
					className="w-full rounded-xl bg-gradient-to-r from-[#f44fa1] via-[#9255d8] to-[#4f7ad8] px-5 py-3 text-lg font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
				>
					{status === "uploading" ? "Subiendo..." : "Enviar fotos"}
				</button>
			</form>

			{feedback ? (
				<p
					className={`mt-4 text-center text-sm md:text-base ${
						status === "error" ? "text-[#a42742]" : "text-[#3f2a64]"
					}`}
				>
					{feedback}
				</p>
			) : null}
		</section>
	);
}
