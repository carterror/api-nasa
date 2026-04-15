import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes } from "next/font/google";
import Link from "next/link";
import CommentsModal from "./comments-modal";
import CopyButton from "./copy-button";
import PlaylistModal from "./playlist-modal";
import RsvpModal from "./rsvp-modal";
import WeddingCountdown from "./wedding-countdown";
import Image from "next/image";

export const dynamic = "force-dynamic";

const titleFont = Great_Vibes({
	subsets: ["latin"],
	weight: ["400"],
});

const bodyFont = Cormorant_Garamond({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	alternates: {
		canonical: "https://love.carana26.com/boda",
	},
	title: "Invitación de boda | Carlos y Ana",
	description: "Celebremos juntos nuestra boda. Carlos y Ana.",
	openGraph: {
		title: "Invitación de boda | Carlos y Ana 💕",
		description: "Celebremos juntos nuestra boda. Carlos y Ana. Como el universo es infinito, así es nuestro amor. Cada día una nueva maravilla del universo dedicada para ti.",
		images: [
		{
			url: "/savedate.png",
			width: 1284,
			height: 1392,
			alt: "Invitación de boda de Carlos y Ana - Save the date. Celebremos juntos nuestra boda. Carlos y Ana. Como el universo es infinito, así es nuestro amor. Cada día una nueva maravilla del universo dedicada para ti.",
		},
		],
	},
};

const eventDetails = [
	{
		label: "Ceremonia",
		value: "2:00 p. m. | Quinta Ontaneda Lote 111 Conocoto, Quito",
		href: "https://maps.app.goo.gl/K1nS2nuQGZB2VcZu8",
	},
	{
		label: "Fiesta",
		value: "3:00 p. m. | Quinta Ontaneda Lote 111 Conocoto, Quito",
		href: "https://maps.app.goo.gl/K1nS2nuQGZB2VcZu8",
	},
	{
		label: "Código de vestimenta",
		value: "Formal elegante en tonos oscuros y neutros.",
		colores: "Los colores blanco, rosado y azul están reservados para los novios."
	}
];

export default async function BodaPage() {
	return (
		<main
			className={`${bodyFont.className} relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_0%,_#ffffff_0%,_#fdf4f5_30%,_#faeaeb_58%,_#F8DBDD_100%)] px-6 py-10 text-[#00345B] md:px-10`}
		>
			<div className="pointer-events-none absolute -top-28 -left-20 h-72 w-72 rounded-full bg-[#ffffff]/80 blur-3xl" />
			<div className="pointer-events-none absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-[#F8DBDD]/60 blur-3xl" />

			<div className="relative mx-auto flex w-full max-w-4xl flex-col gap-8 rounded-[2rem] border border-white/85 bg-white/78 p-6 shadow-[0_20px_60px_rgba(18,54,99,0.18)] backdrop-blur-sm md:p-10">
				<header className="text-center">
					<p className="mb-6 text-md tracking-[0.35em] text-[#005a8e] uppercase">
						Tenemos una noticia hermosa
					</p>

					<div className="mb-8 inline-flex flex-col items-center gap-3">
						<p className="text-sm tracking-[0.25em] text-[#005a8e]/100 uppercase">
							Con nuestro amor y la bendición de nuestros padres
						</p>
						<div className="flex items-center justify-center gap-6 md:gap-10">
							<div className="text-right">
								<p className="mb-0.5 text-[10px] tracking-[0.18em] text-[#005a8e]/100 uppercase">
									Padres del novio
								</p>
								<p className="text-base font-semibold text-[#00345B]">Carlos Luis Ramila</p>
								<p className="my-0.5 text-xs text-[#F8DBDD]">✦</p>
								<p className="text-base font-semibold text-[#00345B]">Imayacil Chorens</p>
							</div>
							<div className="h-14 w-px bg-gradient-to-b from-transparent via-[#F8DBDD] to-transparent" />
							<div className="text-left">
								<p className="mb-0.5 text-[10px] tracking-[0.18em] text-[#005a8e]/100 uppercase">
									Padres de la novia
								</p>
								<p className="text-base font-semibold text-[#00345B]">Luis Leonel Rojas</p>
								<p className="my-0.5 text-xs text-[#F8DBDD]">✦</p>
								<p className="text-base font-semibold text-[#00345B]">Araima Saco</p>
							</div>
						</div>
					</div>

					<div className="mx-auto mb-6 w-full overflow-hidden rounded-2xl shadow-[inset_0_2px_8px_rgba(0,52,91,0.15),_0_8px_32px_rgba(201,160,164,0.35)] md:w-80">
						<img
							src="/savedate.png"
							alt="Carlos y Ana - Save the date"
							className="h-full w-full object-cover"
						/>
					</div>

					<h1 className={`${titleFont.className} text-6xl leading-tight text-[#00345B] md:text-8xl`}>
						Carlos &amp; Ana
					</h1>
					<p className="mx-auto mt-3 max-w-2xl text-lg leading-relaxed text-[#004d7a] md:text-2xl">
						Como el universo es infinito, así es nuestro
						amor. Nos casamos y queremos celebrarlo contigo.
					</p>
				</header>

				<section className="rounded-3xl border border-[#F8DBDD]/80 bg-gradient-to-b from-white to-[#fff5f6] p-6 text-center shadow-inner md:p-8">
					<p className="text-base tracking-[0.25em] text-[#005a8e] uppercase">Sábado</p>
					<p className="mt-2 text-5xl font-semibold text-[#00345B] md:text-6xl">1</p>
					<p className="text-2xl font-medium text-[#005a8e] md:text-3xl">agosto 2026</p>
					<p className="mt-4 text-lg">Comienza a las 14:00 p. m.</p>
				</section>

				<WeddingCountdown />

				<section className="grid gap-4 md:grid-cols-2">
					{eventDetails.map((item) => (
						<article
							key={item.label}
							className="rounded-2xl border border-[#F8DBDD]/80 bg-[#fff5f6] p-5 shadow-[0_8px_26px_rgba(0,52,91,0.09)]"
						>
							<h2 className="text-xs tracking-[0.25em] text-[#005a8e] uppercase">
								{item.label}
							</h2>
							{item.href ? (
								<a
									href={item.href}
									target="_blank"
									rel="noopener noreferrer"
									className="mt-2 inline-block text-xl font-semibold text-[#00345B] underline decoration-[#F8DBDD] underline-offset-4 hover:text-[#005a8e]"
								>
									{item.value}
								</a>
							) : (
								<p className="mt-2 text-xl font-semibold text-[#00345B]">{item.value}</p>
							)}
							{"colores" in item && (
								<div>
									<img
										src="/vestimenta.png"
										alt="Código de vestimenta"
										className="w-50 object-cover mt-4 rounded-md shadow-md align-middle mx-auto"
									/>
									<p className="mt-1 text-sm text-center text-[#005a8e]">{item.colores}</p>
								</div>
							)}
						</article>
					))}
				</section>

				<section className="rounded-3xl border border-[#F8DBDD]/80 bg-white/85 p-6 text-center md:p-8">
					<p className="text-xs tracking-[0.25em] text-[#005a8e] uppercase">Confirmación</p>
					<h2 className="mt-2 text-3xl font-semibold text-[#00345B] md:text-4xl">
						Confirma tu asistencia
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-base text-[#004d7a] md:text-lg">
						Agradecemos que confirmes tu asistencia antes del 1 de junio.
					</p>
					<RsvpModal />
				</section>

				<section className="flex justify-center">
					<div className="w-full max-w-sm overflow-hidden rounded-3xl shadow-[0_16px_48px_rgba(201,160,164,0.45)] border border-[#F8DBDD]/80">
						<img
							src="/foto1.png"
							alt="Carlos y Ana"
							className="h-full w-full object-cover"
						/>
					</div>
				</section>

				<section className="rounded-3xl border border-[#F8DBDD]/80 bg-white/85 p-6 text-center md:p-8">
					<p className="text-xs tracking-[0.25em] text-[#005a8e] uppercase">Playlist</p>
					<h2 className="mt-2 text-3xl font-semibold text-[#00345B] md:text-4xl">
						Canciones que no pueden faltar
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-base text-[#004d7a] md:text-lg">
						Ayúdanos a crear la playlist perfecta. ¿Cuáles son las 3 canciones que no pueden faltar en nuestra boda?
					</p>
					<PlaylistModal />
				</section>

				<section className="rounded-3xl border border-[#F8DBDD]/80 bg-white/85 p-6 text-center md:p-8">
					<p className="text-xs tracking-[0.25em] text-[#005a8e] uppercase">Dedicatorias</p>
					<h2 className="mt-2 text-3xl font-semibold text-[#00345B] md:text-4xl">
						Te leemos con mucho amor
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-base text-[#004d7a] md:text-lg">
						Si quieres dejarnos unas palabras.
					</p>
					<CommentsModal />
				</section>

				<section className="rounded-3xl border border-dashed border-[#F8DBDD] bg-[#fff5f6]/90 p-6 text-center md:p-8">
				<p className="text-xs tracking-[0.25em] text-[#005a8e] uppercase">Sugerencias de regalo</p>
					<p className="text-xl md:text-2xl">
						Tu presencia es nuestro mejor regalo.
					</p>
					<p className="mt-2 text-base leading-relaxed text-[#004d7a] md:text-lg">
						Si deseas tener un detalle con nosotros, aquí te dejamos algunas ideas que nos encantarían:
					</p>
					<ul className="mt-4 text-left text-[#004d7a] md:text-lg">
						<li className="mb-2 flex items-start gap-2">
							<span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#F8DBDD]" />
							<span>Lluvia de sobres</span>
						</li>
						<li className="mb-2 flex items-start gap-2">
							<span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[#F8DBDD]" />
							<span className="w-full">
								Transferencia:
								<ul className="mt-2 w-full divide-y divide-[#F8DBDD]/60 rounded-xl border border-[#F8DBDD]/80 bg-white/70 text-sm">
									{[
										{ label: "Banco", value: "Banco Guayaquil" },
										{ label: "Cuenta", value: "0057795489" },
										{ label: "CI", value: "1762797007" },
										{ label: "Nombre", value: "Carlos Brayan Rámila Chorens" },
									].map(({ label, value }) => (
										<li key={label} className="flex items-center justify-between gap-2 px-3 py-2">
											<div className="flex flex-col">
												<span className="text-xs tracking-wide text-[#005a8e] uppercase">{label}</span>
												<span className="font-semibold text-[#00345B]">{value}</span>
											</div>
											<CopyButton text={value} />
										</li>
									))}
								</ul>
							</span>
						</li>
					</ul>
				</section>
								<section className="flex justify-center">
					<div className="w-full max-w-sm overflow-hidden rounded-3xl shadow-[0_16px_48px_rgba(201,160,164,0.45)] border border-[#F8DBDD]/80">
						<Image
							src="/foto2.png"
							alt="Carlos y Ana"
							className="w-full object-cover"
							width={500}
							height={500}
							sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
							unoptimized
							loading="eager"		
						/>
					</div>
				</section>

				<section className="rounded-3xl border border-[#F8DBDD]/80 bg-white/85 p-6 text-center md:p-8">
					<p className="text-xs tracking-[0.25em] text-[#005a8e] uppercase">Álbum colaborativo</p>
					<h2 className="mt-2 text-3xl font-semibold text-[#00345B] md:text-4xl">
						Sube y mira todas las fotos de la boda
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-base text-[#004d7a] md:text-lg">
						Creamos una página especial para que todos compartan sus mejores recuerdos.
					</p>
					<Link
						href="/boda/fotos"
						className="mt-5 inline-block rounded-xl bg-[#00345B] px-6 py-3 text-lg font-semibold text-white transition hover:brightness-110"
					>
						Ir a la galería de invitados
					</Link>
				</section>

				<section className="rounded-3xl border border-[#F8DBDD]/80 bg-white/85 p-6 text-center md:p-8">
					<p className="text-xs tracking-[0.25em] text-[#005a8e] uppercase">Ubicación</p>
					<h2 className="mt-2 text-3xl font-semibold text-[#00345B] md:text-4xl">
						¿Cómo llegar?
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-base text-[#004d7a] md:text-lg">
						Quinta Ontaneda Lote 111, Conocoto, Quito.
					</p>
					<div className="mt-6 overflow-hidden rounded-2xl shadow-[0_8px_32px_rgba(0,52,91,0.15)]">
						<iframe
							src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d591.5810743003121!2d-78.4931584!3d-0.3016376!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d5a3cb2d557cbb%3A0xdd6c78080b4f3e93!2sLa%20Toscana%20Garden!5e1!3m2!1ses!2sec!4v1776223493295!5m2!1ses!2sec"
							width="100%"
							height="400"
							loading="lazy"
							className="block w-full border-0"
						/>
					</div>
				</section>

				<section className="rounded-3xl border border-[#F8DBDD]/80 bg-white/85 p-6 text-center md:p-8">
					<p className="text-xs tracking-[0.25em] text-[#005a8e] uppercase">Contacto</p>
					<h2 className="mt-2 text-3xl font-semibold text-[#00345B] md:text-4xl">
						¿Tienes alguna pregunta?
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-base text-[#004d7a] md:text-lg">
						Escríbenos, con gusto te respondemos.
					</p>
					<div className="mt-6 grid gap-4 md:grid-cols-2">
						<a
							href="https://wa.me/+593981643549"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center gap-3 rounded-2xl border border-[#F8DBDD]/80 bg-[#fff5f6] px-5 py-4 text-[#00345B] shadow-[0_4px_16px_rgba(0,52,91,0.08)] transition hover:brightness-95"
						>
							<span className="text-2xl">💬</span>
							<div className="text-left">
								<p className="text-xs tracking-[0.2em] text-[#005a8e] uppercase">Carlos</p>
								<p className="text-base font-semibold">+593 98 164 35 49</p>
							</div>
						</a>
						<a
							href="https://wa.me/+593987604032"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center justify-center gap-3 rounded-2xl border border-[#F8DBDD]/80 bg-[#fff5f6] px-5 py-4 text-[#00345B] shadow-[0_4px_16px_rgba(0,52,91,0.08)] transition hover:brightness-95"
						>
							<span className="text-2xl">💬</span>
							<div className="text-left">
								<p className="text-xs tracking-[0.2em] text-[#005a8e] uppercase">Ana</p>
								<p className="text-base font-semibold">+593 98 760 4032</p>
							</div>
						</a>
					</div>
				</section>
			</div>
		</main>
	);
}

