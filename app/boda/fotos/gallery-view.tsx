"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import PhotoUploadSection from "../photo-upload-section";

interface PhotoItem {
	key: string;
	url?: string;
	lastModified?: string | null;
}

interface ApiResponse {
	photos?: PhotoItem[];
	error?: string;
}

export default function GalleryView() {
	const [photos, setPhotos] = useState<PhotoItem[]>([]);
	const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
	const [error, setError] = useState("");

	const loadPhotos = useCallback(async () => {
		setStatus("loading");
		setError("");

		try {
			const response = await fetch("/api/wedding-photos", { cache: "no-store" });
			const data: ApiResponse = await response.json();
			if (!response.ok) {
				throw new Error(data.error ?? "No se pudieron cargar las fotos.");
			}
			setPhotos(data.photos ?? []);
			setStatus("idle");
		} catch (currentError) {
			setStatus("error");
			setError(
				currentError instanceof Error
					? currentError.message
					: "Ocurrio un error al obtener la galeria.",
			);
		}
	}, []);

	useEffect(() => {
		void loadPhotos();
	}, [loadPhotos]);

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
			<PhotoUploadSection onUploadComplete={() => void loadPhotos()} />

			<section className="rounded-3xl border border-[#cab4ee]/70 bg-white/80 p-6 md:p-8">
				<div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
					<div>
						<p className="text-xs tracking-[0.25em] text-[#8a4ca1] uppercase">Momentos compartidos</p>
						<h2 className="mt-2 text-3xl font-semibold text-[#4f2d84] md:text-4xl">
							Fotos de nuestros invitados
						</h2>
					</div>
					<button
						type="button"
						onClick={() => void loadPhotos()}
						className="rounded-xl border border-[#a86ee4] px-4 py-2 text-sm font-semibold text-[#5b3498] transition hover:bg-[#f5eaff]"
					>
						Actualizar galeria
					</button>
				</div>

				{status === "loading" ? (
					<p className="text-center text-[#5d3b8e]">Cargando fotos...</p>
				) : null}

				{status === "error" ? (
					<p className="text-center text-[#a42742]">{error}</p>
				) : null}

				{status !== "loading" && photos.length === 0 ? (
					<p className="text-center text-[#5d3b8e]">
						Aun no hay fotos publicas. Sube la primera imagen del gran dia.
					</p>
				) : null}

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{photos.map((photo) => (
						<article
							key={photo.key}
							className="overflow-hidden rounded-2xl border border-[#d6c0f2] bg-[#faf6ff]"
						>
							{photo.url ? (
								<div className="relative h-64 w-full">
									<Image
										src={photo.url}
										alt="Foto de invitado"
										fill
										sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
										className="object-cover"
										unoptimized
									/>
								</div>
							) : (
								<div className="flex h-64 w-full items-center justify-center p-4 text-center text-sm text-[#614292]">
									Configura AWS_S3_PUBLIC_BASE_URL para mostrar las imagenes aqui.
								</div>
							)}

							<div className="p-3 text-xs text-[#563d87]">
								{photo.lastModified
									? `Subida: ${new Date(photo.lastModified).toLocaleString("es-EC")}`
									: "Fecha no disponible"}
							</div>
						</article>
					))}
				</div>
			</section>
		</div>
	);
}
