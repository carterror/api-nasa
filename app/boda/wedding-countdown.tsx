"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownParts = {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	isComplete: boolean;
};

const EVENT_DATE = new Date("2026-08-01T12:00:00-05:00");

function getCountdownParts(): CountdownParts {
	const now = new Date();
	const diffMs = EVENT_DATE.getTime() - now.getTime();

	if (diffMs <= 0) {
		return {
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
			isComplete: true,
		};
	}

	const totalSeconds = Math.floor(diffMs / 1000);
	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor((totalSeconds % 86400) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return {
		days,
		hours,
		minutes,
		seconds,
		isComplete: false,
	};
}

function formatNumber(value: number) {
	return value.toString().padStart(2, "0");
}

export default function WeddingCountdown() {
	const [timeLeft, setTimeLeft] = useState<CountdownParts>(() => getCountdownParts());

	useEffect(() => {
		const timer = window.setInterval(() => {
			setTimeLeft(getCountdownParts());
		}, 1000);

		return () => {
			window.clearInterval(timer);
		};
	}, []);

	const blocks = useMemo(
		() => [
			{ label: "dias", value: timeLeft.days },
			{ label: "horas", value: timeLeft.hours },
			{ label: "min", value: timeLeft.minutes },
			{ label: "seg", value: timeLeft.seconds },
		],
		[timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds],
	);

	if (timeLeft.isComplete) {
		return (
			<section className="relative overflow-hidden rounded-3xl border border-[#f0b7d4] bg-gradient-to-br from-[#fff8fb] via-[#fff3f8] to-[#f9ecff] p-6 text-center shadow-[0_12px_40px_rgba(98,42,148,0.12)] md:p-8">
				<p className="text-xs tracking-[0.25em] text-[#b14787] uppercase">Cuenta regresiva</p>
				<h2 className="mt-2 text-3xl font-semibold text-[#5d2a8c] md:text-4xl">Llego nuestro gran dia</h2>
				<p className="mx-auto mt-3 max-w-xl text-base text-[#5c437e] md:text-lg">
					Hoy celebramos nuestro amor contigo. Gracias por ser parte de esta historia.
				</p>
			</section>
		);
	}

	return (
		<section className="relative overflow-hidden rounded-3xl border border-[#f0b7d4] bg-gradient-to-br from-[#fff8fb] via-[#fff3f8] to-[#f9ecff] p-6 shadow-[0_12px_40px_rgba(98,42,148,0.12)] md:p-8">
			<div className="pointer-events-none absolute -top-14 -left-12 h-36 w-36 rounded-full bg-[#f9badf]/40 blur-2xl" />
			<div className="pointer-events-none absolute -right-10 -bottom-14 h-40 w-40 rounded-full bg-[#bdb9ff]/40 blur-2xl" />

			<div className="relative text-center">
				<p className="text-xs tracking-[0.25em] text-[#b14787] uppercase">Cuenta regresiva</p>
				<h2 className="mt-2 text-3xl font-semibold text-[#5d2a8c] md:text-4xl">Falta poquito para la boda</h2>
				<p className="mx-auto mt-3 max-w-xl text-base text-[#5c437e] md:text-lg">
					Cada segundo nos acerca a celebrar juntos uno de los dias mas felices de nuestras vidas.
				</p>
			</div>

			<div className="relative mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
				{blocks.map((block) => (
					<article
						key={block.label}
						className="rounded-2xl border border-white/80 bg-white/75 p-4 text-center shadow-[0_8px_22px_rgba(89,46,136,0.12)] backdrop-blur-sm"
					>
						<p className="text-4xl font-semibold leading-none text-[#4a2f72] md:text-5xl">
							{formatNumber(block.value)}
						</p>
						<p className="mt-2 text-xs tracking-[0.2em] text-[#a65b93] uppercase">{block.label}</p>
					</article>
				))}
			</div>
		</section>
	);
}
