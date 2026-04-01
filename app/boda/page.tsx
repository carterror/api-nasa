import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes } from "next/font/google";
import Link from "next/link";
import CommentsModal from "./comments-modal";
import RsvpModal from "./rsvp-modal";
import WeddingCountdown from "./wedding-countdown";

const titleFont = Great_Vibes({
	subsets: ["latin"],
	weight: ["400"],
});

const bodyFont = Cormorant_Garamond({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "Invitacion de boda | Carlos y Ana",
	description: "Celebremos juntos nuestra boda. Carlos y Ana.",
};

const eventDetails = [
	{
		label: "Ceremonia",
		value: "4:30 p. m. | Conocoto, Quito",
	},
	{
		label: "Recepcion",
		value: "6:30 p. m. | Conocoto, Quito",
	},
	{
		label: "Codigo de vestimenta",
		value: "Formal elegante en tonos oscuros",
	},
	{
		label: "Confirmacion",
		value: "Antes del 1 de junio",
	},
];

export default function BodaPage() {

	return (
		<main
			className={`${bodyFont.className} min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#ffe6f4_0%,_#f4ddff_40%,_#d4c8ff_72%,_#bcd6ff_100%)] px-6 py-10 text-[#32214b] md:px-10`}
		>
			<div className="mx-auto flex w-full max-w-4xl flex-col gap-8 rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(66,36,120,0.22)] backdrop-blur-sm md:p-10">
				<header className="text-center">
					<p className="mb-2 text-sm tracking-[0.35em] text-[#8a4ca1] uppercase">
						Tenemos una noticia hermosa
					</p>
					<h1 className={`${titleFont.className} text-6xl leading-tight text-[#5c2a90] md:text-8xl`}>
						Carlos &amp; Ana
					</h1>
					<p className="mx-auto mt-3 max-w-2xl text-lg leading-relaxed text-[#3c2a5f] md:text-2xl">
						Para el amor de mi vida. Como el universo es infinito, asi es nuestro
						amor. Nos casamos y queremos celebrarlo contigo.
					</p>
				</header>

				<section className="rounded-3xl border border-[#d5b5ec]/60 bg-white/80 p-6 text-center shadow-inner md:p-8">
					<p className="text-base tracking-[0.25em] text-[#8a4ca1] uppercase">Sabado</p>
					<p className="mt-2 text-5xl font-semibold text-[#4f2d84] md:text-6xl">1</p>
					<p className="text-2xl font-medium text-[#6d43a8] md:text-3xl">agosto 2026</p>
					<p className="mt-4 text-lg">Comienza a las 12:00 p. m.</p>
				</section>

				<WeddingCountdown />

				<section className="grid gap-4 md:grid-cols-2">
					{eventDetails.map((item) => (
						<article
							key={item.label}
							className="rounded-2xl border border-[#d5b8f0]/70 bg-[#fcf8ff]/80 p-5 shadow-[0_8px_30px_rgba(76,38,130,0.1)]"
						>
							<h2 className="text-xs tracking-[0.25em] text-[#8a4ca1] uppercase">
								{item.label}
							</h2>
							<p className="mt-2 text-xl font-semibold text-[#3f2a64]">{item.value}</p>
						</article>
					))}
				</section>

				<section className="rounded-3xl border border-[#c9a7ea]/70 bg-white/80 p-6 text-center md:p-8">
					<p className="text-xs tracking-[0.25em] text-[#8a4ca1] uppercase">Confirmacion</p>
					<h2 className="mt-2 text-3xl font-semibold text-[#4f2d84] md:text-4xl">
						Confirma tu asistencia
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-base text-[#4a3a6c] md:text-lg">
						Solo podran confirmar las personas incluidas en la lista de invitados.
					</p>
					<RsvpModal />
				</section>

				<section className="rounded-3xl border border-[#c9a7ea]/70 bg-white/80 p-6 text-center md:p-8">
					<p className="text-xs tracking-[0.25em] text-[#8a4ca1] uppercase">Dedicatorias</p>
					<h2 className="mt-2 text-3xl font-semibold text-[#4f2d84] md:text-4xl">
						Te leemos con mucho amor
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-base text-[#4a3a6c] md:text-lg">
						Si quieres dejarnos unas palabras, abre el modal y comparte tu mensaje.
					</p>
					<CommentsModal />
				</section>

				<section className="rounded-3xl border border-dashed border-[#8c5ad7] bg-[#f7efff]/90 p-6 text-center md:p-8">
					<p className="text-xl md:text-2xl">
						Tu presencia es nuestro mejor regalo.
					</p>
					<p className="mt-2 text-base leading-relaxed text-[#563d87] md:text-lg">
						Si deseas tener un detalle con nosotros, tendremos una mesa de sobres
						el dia del evento.
					</p>
				</section>

				<section className="rounded-3xl border border-[#c9a7ea]/70 bg-white/80 p-6 text-center md:p-8">
					<p className="text-xs tracking-[0.25em] text-[#8a4ca1] uppercase">Album colaborativo</p>
					<h2 className="mt-2 text-3xl font-semibold text-[#4f2d84] md:text-4xl">
						Sube y mira todas las fotos de la boda
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-base text-[#4a3a6c] md:text-lg">
						Creamos una pagina especial para que todos compartan sus mejores recuerdos.
					</p>
					<Link
						href="/boda/fotos"
						className="mt-5 inline-block rounded-xl bg-gradient-to-r from-[#f44fa1] via-[#9255d8] to-[#4f7ad8] px-6 py-3 text-lg font-semibold text-white transition hover:brightness-110"
					>
						Ir a la galeria de invitados
					</Link>
				</section>
			</div>
		</main>
	);
}

