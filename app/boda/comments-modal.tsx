"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

interface CommentsApiResponse {
	invitedGuests?: string[];
	error?: string;
}

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export default function CommentsModal() {
	const [isOpen, setIsOpen] = useState(false);
	const [invitedGuests, setInvitedGuests] = useState<string[]>([]);
	const [loadingGuests, setLoadingGuests] = useState(false);
	const [name, setName] = useState("");
	const [comment, setComment] = useState("");
	const [status, setStatus] = useState<SubmitStatus>("idle");
	const [feedback, setFeedback] = useState("");

	const canSubmit = useMemo(() => {
		if (!name || !comment || loadingGuests || invitedGuests.length === 0) {
			return false;
		}

		return comment.length <= 500;
	}, [comment, invitedGuests.length, loadingGuests, name]);

	useEffect(() => {
		if (!isOpen || invitedGuests.length > 0) {
			return;
		}

		let ignore = false;

		async function loadGuests() {
			setLoadingGuests(true);
			setFeedback("");

			try {
				const response = await fetch("/api/wedding-comments", { method: "GET" });
				const data: CommentsApiResponse = await response.json();

				if (!response.ok) {
					throw new Error(data.error ?? "No pudimos cargar la lista de invitados.");
				}

				if (!ignore) {
					setInvitedGuests(data.invitedGuests ?? []);
				}
			} catch (error) {
				if (!ignore) {
					setFeedback(
						error instanceof Error
							? error.message
							: "No pudimos cargar la lista de invitados.",
					);
					setStatus("error");
				}
			} finally {
				if (!ignore) {
					setLoadingGuests(false);
				}
			}
		}

		loadGuests();

		return () => {
			ignore = true;
		};
	}, [invitedGuests.length, isOpen]);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!canSubmit) {
			return;
		}

		setStatus("submitting");
		setFeedback("Enviando mensaje...");

		try {
			const response = await fetch("/api/wedding-comments", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, comment }),
			});

			const data: { message?: string; error?: string } = await response.json();
			if (!response.ok) {
				throw new Error(data.error ?? "No se pudo guardar tu mensaje.");
			}

			setStatus("success");
			setFeedback(data.message ?? "Mensaje guardado correctamente.");
			setName("");
			setComment("");
		} catch (error) {
			setStatus("error");
			setFeedback(
				error instanceof Error ? error.message : "No se pudo guardar tu mensaje.",
			);
		}
	}

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="mt-4 inline-flex rounded-xl border border-[#9dc4ea] bg-white px-6 py-3 text-lg font-semibold text-[#1c4f90] transition hover:bg-[#eef6ff]"
			>
				Dejarnos un mensaje
			</button>

			{isOpen ? (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f2e54]/65 px-4"
					onClick={() => setIsOpen(false)}
				>
					<div
						className="w-full max-w-xl rounded-3xl border border-[#b8d5f4]/80 bg-white p-6 shadow-[0_16px_40px_rgba(17,50,92,0.3)] md:p-8"
						onClick={(event) => event.stopPropagation()}
					>
						<div className="flex items-start justify-between gap-4">
							<div>
								<p className="text-xs tracking-[0.25em] text-[#356ca7] uppercase">Mensajes</p>
								<h3 className="mt-1 text-2xl font-semibold text-[#1d4f8f] md:text-3xl">
									Dejanos tu comentario
								</h3>
							</div>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="rounded-lg border border-[#bad7f5] px-3 py-1 text-sm text-[#1d4f8f]"
							>
								Cerrar
							</button>
						</div>

						<form className="mt-6 space-y-4" onSubmit={handleSubmit}>
							<label className="block text-sm font-medium text-[#295788]" htmlFor="comment-name">
								Nombre del invitado
							</label>
							<select
								id="comment-name"
								value={name}
								onChange={(event) => setName(event.target.value)}
								disabled={loadingGuests || invitedGuests.length === 0 || status === "submitting"}
								className="w-full rounded-xl border border-[#c2ddf7] bg-[#f4f9ff] px-4 py-3 text-[#1f4b7f]"
							>
								<option value="">
									{loadingGuests
										? "Cargando invitados..."
										: invitedGuests.length > 0
											? "Selecciona tu nombre"
											: "No hay invitados configurados"}
								</option>
								{invitedGuests.map((guestName) => (
									<option key={guestName} value={guestName}>
										{guestName}
									</option>
								))}
							</select>

							<div>
								<label className="block text-sm font-medium text-[#295788]" htmlFor="comment-text">
									Tu mensaje
								</label>
								<textarea
									id="comment-text"
									value={comment}
									onChange={(event) => setComment(event.target.value)}
									maxLength={500}
									disabled={status === "submitting"}
									rows={5}
									className="mt-1 w-full rounded-xl border border-[#c2ddf7] bg-[#f4f9ff] px-4 py-3 text-[#1f4b7f]"
								/>
								<p className="mt-1 text-right text-xs text-[#3f75ac]">{comment.length}/500</p>
							</div>

							<button
								type="submit"
								disabled={!canSubmit || status === "submitting"}
								className="w-full rounded-xl bg-gradient-to-r from-[#1f5fa8] via-[#2f79c4] to-[#68a8df] px-5 py-3 text-lg font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
							>
								{status === "submitting" ? "Enviando..." : "Enviar mensaje"}
							</button>
						</form>

						{feedback ? (
							<p
								className={`mt-4 text-sm ${
									status === "error" ? "text-[#9f2a3f]" : "text-[#1f4b7f]"
								}`}
							>
								{feedback}
							</p>
						) : null}
					</div>
				</div>
			) : null}
		</>
	);
}
