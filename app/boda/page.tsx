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
		value: "Formal elegante en tonos azules y neutros",
	},
	{
		label: "Confirmacion",
		value: "Antes del 1 de junio",
	},
];

export default function BodaPage() {

	return (
		<main
			className={`${bodyFont.className} relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_0%,_#ffffff_0%,_#eaf4ff_30%,_#dbeeff_58%,_#c5e2ff_100%)] px-6 py-10 text-[#11315b] md:px-10`}
		>
			<div className="pointer-events-none absolute -top-28 -left-20 h-72 w-72 rounded-full bg-[#ffffff]/80 blur-3xl" />
			<div className="pointer-events-none absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-[#8cc6ff]/25 blur-3xl" />

			<div className="relative mx-auto flex w-full max-w-4xl flex-col gap-8 rounded-[2rem] border border-white/85 bg-white/78 p-6 shadow-[0_20px_60px_rgba(18,54,99,0.18)] backdrop-blur-sm md:p-10">
				<header className="text-center">
					<p className="mb-2 text-sm tracking-[0.35em] text-[#2f5e96] uppercase">
						Tenemos una noticia hermosa
					</p>
					<h1 className={`${titleFont.className} text-6xl leading-tight text-[#184783] md:text-8xl`}>
						Carlos &amp; Ana
					</h1>
					<p className="mx-auto mt-3 max-w-2xl text-lg leading-relaxed text-[#244c7b] md:text-2xl">
						Para el amor de mi vida. Como el universo es infinito, asi es nuestro
						amor. Nos casamos y queremos celebrarlo contigo.
					</p>
				</header>

				<section className="rounded-3xl border border-[#b9d7f5]/80 bg-gradient-to-b from-white to-[#f2f8ff] p-6 text-center shadow-inner md:p-8">
					<p className="text-base tracking-[0.25em] text-[#2f5e96] uppercase">Sabado</p>
					<p className="mt-2 text-5xl font-semibold text-[#1b4f8f] md:text-6xl">1</p>
					<p className="text-2xl font-medium text-[#3569a5] md:text-3xl">agosto 2026</p>
					<p className="mt-4 text-lg">Comienza a las 12:00 p. m.</p>
				</section>

				<WeddingCountdown />

				<section className="grid gap-4 md:grid-cols-2">
					{eventDetails.map((item) => (
						<article
							key={item.label}
							className="rounded-2xl border border-[#c4def8]/80 bg-[#f7fbff] p-5 shadow-[0_8px_26px_rgba(24,73,132,0.09)]"
						>
							<h2 className="text-xs tracking-[0.25em] text-[#2f5e96] uppercase">
								{item.label}
							</h2>
							<p className="mt-2 text-xl font-semibold text-[#204a7e]">{item.value}</p>
						</article>
					))}
				</section>

				<section className="rounded-3xl border border-[#b7d5f5]/80 bg-white/85 p-6 text-center md:p-8">
					<p className="text-xs tracking-[0.25em] text-[#2f5e96] uppercase">Confirmacion</p>
					<h2 className="mt-2 text-3xl font-semibold text-[#1c4e8f] md:text-4xl">
						Confirma tu asistencia
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-base text-[#325e90] md:text-lg">
						Solo podran confirmar las personas incluidas en la lista de invitados.
					</p>
					<RsvpModal />
				</section>

				<section className="rounded-3xl border border-[#b7d5f5]/80 bg-white/85 p-6 text-center md:p-8">
					<p className="text-xs tracking-[0.25em] text-[#2f5e96] uppercase">Dedicatorias</p>
					<h2 className="mt-2 text-3xl font-semibold text-[#1c4e8f] md:text-4xl">
						Te leemos con mucho amor
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-base text-[#325e90] md:text-lg">
						Si quieres dejarnos unas palabras, abre el modal y comparte tu mensaje.
					</p>
					<CommentsModal />
				</section>

				<section className="rounded-3xl border border-dashed border-[#5d90c9] bg-[#eef6ff]/90 p-6 text-center md:p-8">
					<p className="text-xl md:text-2xl">
						Tu presencia es nuestro mejor regalo.
					</p>
					<p className="mt-2 text-base leading-relaxed text-[#346194] md:text-lg">
						Si deseas tener un detalle con nosotros, tendremos una mesa de sobres
						el dia del evento.
					</p>
				</section>

				<section className="rounded-3xl border border-[#b7d5f5]/80 bg-white/85 p-6 text-center md:p-8">
					<p className="text-xs tracking-[0.25em] text-[#2f5e96] uppercase">Album colaborativo</p>
					<h2 className="mt-2 text-3xl font-semibold text-[#1c4e8f] md:text-4xl">
						Sube y mira todas las fotos de la boda
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-base text-[#325e90] md:text-lg">
						Creamos una pagina especial para que todos compartan sus mejores recuerdos.
					</p>
					<Link
						href="/boda/fotos"
						className="mt-5 inline-block rounded-xl bg-gradient-to-r from-[#1f5fa8] via-[#2f79c4] to-[#68a8df] px-6 py-3 text-lg font-semibold text-white transition hover:brightness-110"
					>
						Ir a la galeria de invitados
					</Link>
				</section>
			</div>
		</main>
	);
}

