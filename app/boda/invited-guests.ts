function normalizeText(value: string): string {
	return value.trim().replace(/\s+/g, " ");
}

export function getInvitedGuests(): string[] {
	const rawList = process.env.WEDDING_INVITED_GUESTS ?? "";

	return Array.from(
		new Set(
			rawList
				.split(/[\n,;]+/)
				.map((name) => normalizeText(name))
				.filter(Boolean),
		),
	);
}

export function canonicalizeName(value: string): string {
	return normalizeText(value)
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase();
}
