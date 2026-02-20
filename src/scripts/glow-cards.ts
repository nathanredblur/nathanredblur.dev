const CONFIG = {
	proximity: 40,
	spread: 80,
	blur: 12,
	gap: 32,
	opacity: 0,
} as const;

let cleanup: (() => void) | null = null;

export function initGlowCards() {
	cleanup?.();

	const containers = document.querySelectorAll<HTMLDivElement>(".glow-container");
	const allCards: HTMLDivElement[] = [];

	for (const container of containers) {
		const identifier = container.className.match(/glow-container-(\S+)/)?.[1];
		if (!identifier || identifier === "glow-container") continue;

		const cards = container.querySelectorAll<HTMLDivElement>(`.glow-card-${identifier}`);
		for (const card of cards) {
			allCards.push(card);
		}

		container.style.setProperty("--gap", `${CONFIG.gap}`);
		container.style.setProperty("--blur", `${CONFIG.blur}`);
		container.style.setProperty("--spread", `${CONFIG.spread}`);
		container.style.setProperty("--direction", "row");
	}

	if (allCards.length === 0) {
		cleanup = null;
		return;
	}

	let rafId: number | null = null;

	const onPointerMove = (event: PointerEvent) => {
		if (rafId !== null) cancelAnimationFrame(rafId);

		rafId = requestAnimationFrame(() => {
			rafId = null;
			const { x: mouseX, y: mouseY } = event;

			// Batch read: collect all bounding rects before any writes
			const rects = allCards.map((card) => card.getBoundingClientRect());

			// Batch write: apply all style changes after reads are done
			for (let i = 0; i < allCards.length; i++) {
				const card = allCards[i];
				const rect = rects[i];

				const isNear =
					mouseX > rect.left - CONFIG.proximity &&
					mouseX < rect.left + rect.width + CONFIG.proximity &&
					mouseY > rect.top - CONFIG.proximity &&
					mouseY < rect.top + rect.height + CONFIG.proximity;

				card.style.setProperty("--active", isNear ? "1" : `${CONFIG.opacity}`);

				const centerX = rect.left + rect.width * 0.5;
				const centerY = rect.top + rect.height * 0.5;
				let angle = (Math.atan2(mouseY - centerY, mouseX - centerX) * 180) / Math.PI;
				if (angle < 0) angle += 360;

				card.style.setProperty("--start", `${angle + 90}`);
			}
		});
	};

	document.body.addEventListener("pointermove", onPointerMove);

	cleanup = () => {
		document.body.removeEventListener("pointermove", onPointerMove);
		if (rafId !== null) cancelAnimationFrame(rafId);
		rafId = null;
	};
}
