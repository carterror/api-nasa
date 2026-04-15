function normalizeText(value: string): string {
	return value.trim().replace(/\s+/g, " ");
}

export function canonicalizeName(value: string): string {
	return normalizeText(value)
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase();
}
