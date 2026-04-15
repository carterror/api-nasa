"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<button
			onClick={handleCopy}
			className="ml-2 rounded-md border border-[#F8DBDD] bg-white px-2 py-0.5 text-xs text-[#005a8e] transition hover:bg-[#F8DBDD]/40 active:scale-95"
			title="Copiar"
		>
			{copied ? "¡Copiado!" : "Copiar"}
		</button>
	);
}
