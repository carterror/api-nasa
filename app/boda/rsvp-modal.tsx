"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

interface RsvpApiResponse {
	invitedGuests?: string[];
	error?: string;
}

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export default function RsvpModal({ enabled }: { enabled: boolean }) {
	const [isOpen, setIsOpen] = useState(false);
	const [invitedGuests, setInvitedGuests] = useState<string[]>([]);
	const [loadingGuests, setLoadingGuests] = useState(false);
	const [name, setName] = useState("");
	const [attending, setAttending] = useState<boolean | null>(null);
	const [guestsCount, setGuestsCount] = useState(0);
	const [message, setMessage] = useState("");
	const [status, setStatus] = useState<SubmitStatus>("idle");
	const [feedback, setFeedback] = useState("");

	const canSubmit = useMemo(() => {
		if (!name || attending === null || loadingGuests || invitedGuests.length === 0) {
			return false;
		}

		if (attending && (guestsCount < 0 || guestsCount > 10)) {
			return false;
		}

		return true;
	}, [attending, guestsCount, invitedGuests.length, loadingGuests, name]);

	useEffect(() => {
		if (!isOpen || invitedGuests.length > 0) {
			return;
		}
		
		let ignore = false;

		async function loadGuests() {
			if (!enabled) return;
			setLoadingGuests(true);
			setFeedback("");

			try {
				const response = await fetch("/api/wedding-rsvp", { method: "GET" });
				const data: RsvpApiResponse = await response.json();

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
		if (!canSubmit || attending === null) {
			return;
		}

		setStatus("submitting");
		setFeedback("Enviando confirmacion...");

		try {
			const response = await fetch("/api/wedding-rsvp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					attending,
					guestsCount: attending ? guestsCount : 0,
					message,
				}),
			});

			const data: { message?: string; error?: string } = await response.json();
			if (!response.ok) {
				throw new Error(data.error ?? "No se pudo registrar tu confirmacion.");
			}

			setStatus("success");
			setFeedback(data.message ?? "Confirmacion registrada correctamente.");
			setName("");
			setAttending(null);
			setGuestsCount(0);
			setMessage("");
		} catch (error) {
			setStatus("error");
			setFeedback(
				error instanceof Error
					? error.message
					: "No se pudo registrar tu confirmacion.",
			);
		}
	}

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="mt-4 inline-flex rounded-xl bg-[#00345B] px-6 py-3 text-lg font-semibold text-white transition hover:brightness-110"
			>
				Confirmar asistencia
			</button>

			{isOpen ? createPortal(
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-[#00345B]/65 px-4"
					onClick={() => setIsOpen(false)}
				>
					<div
						className="w-full max-w-xl rounded-3xl border border-[#F8DBDD]/80 bg-white p-6 shadow-[0_16px_40px_rgba(0,52,91,0.3)] md:p-8"
						onClick={(event) => event.stopPropagation()}
					>
						<div className="flex items-start justify-between gap-4">
							<div>
								<p className="text-xs tracking-[0.25em] text-[#005a8e] uppercase">RSVP</p>
								<h3 className="mt-1 text-2xl font-semibold text-[#00345B] md:text-3xl">
									Confirma tu asistencia
								</h3>
							</div>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="rounded-lg border border-[#F8DBDD] px-3 py-1 text-sm text-[#00345B]"
							>
								Cerrar
							</button>
						</div>

						<form className="mt-6 space-y-4" onSubmit={handleSubmit}>
							<label className="block text-sm font-medium text-[#00345B]" htmlFor="rsvp-name">
								Nombre del invitado
							</label>
							<select
								id="rsvp-name"
								value={name}
								onChange={(event) => setName(event.target.value)}
								disabled={loadingGuests || invitedGuests.length === 0 || status === "submitting"}
								className="w-full rounded-xl border border-[#F8DBDD] bg-[#fff5f6] px-4 py-3 text-[#00345B]"
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

							<fieldset className="space-y-2">
								<legend className="text-sm font-medium text-[#00345B]">Asistiras?</legend>
								<div className="flex gap-4 text-[#00345B]">
									<label className="inline-flex items-center gap-2">
										<input
											type="radio"
											name="attending"
											checked={attending === true}
											onChange={() => setAttending(true)}
											disabled={status === "submitting"}
										/>
										Si
									</label>
									<label className="inline-flex items-center gap-2">
										<input
											type="radio"
											name="attending"
											checked={attending === false}
											onChange={() => setAttending(false)}
											disabled={status === "submitting"}
										/>
										No
									</label>
								</div>
							</fieldset>

							{attending ? (
								<div>
									<label className="block text-sm font-medium text-[#00345B]" htmlFor="rsvp-guests">
										Numero de acompanantes
									</label>
									<input
										id="rsvp-guests"
										type="number"
										min={0}
										max={10}
										value={guestsCount}
										onChange={(event) => setGuestsCount(Number(event.target.value))}
										disabled={status === "submitting"}
										className="mt-1 w-full rounded-xl border border-[#F8DBDD] bg-[#fff5f6] px-4 py-3 text-[#00345B]"
									/>
								</div>
							) : null}

							<div>
								<label className="block text-sm font-medium text-[#00345B]" htmlFor="rsvp-message">
									Mensaje (opcional)
								</label>
								<textarea
									id="rsvp-message"
									value={message}
									onChange={(event) => setMessage(event.target.value)}
									maxLength={300}
									disabled={status === "submitting"}
									rows={4}
									className="mt-1 w-full rounded-xl border border-[#F8DBDD] bg-[#fff5f6] px-4 py-3 text-[#00345B]"
								/>
							</div>

							<button
								type="submit"
								disabled={!canSubmit || status === "submitting"}
								className="w-full rounded-xl bg-[#00345B] px-5 py-3 text-lg font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
							>
								{status === "submitting" ? "Enviando..." : "Enviar confirmacion"}
							</button>
						</form>

						{feedback ? (
							<p
								className={`mt-4 text-sm ${
									status === "error" ? "text-[#9f2a3f]" : "text-[#004d7a]"
								}`}
							>
								{feedback}
							</p>
						) : null}
					</div>
				</div>
		, document.body) : null}
		</>
	);
}
