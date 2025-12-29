export type MainItem = {
	status?: number | null;
	index?: number | null;
	time?: string | number | null;
	show?: string | null;
	left?: string | null;
	raw_time?: string | null;
	distance?: number | string | null;
	time_seconds?: number | string | null;
	engine_work?: number | string | null;
	engine_idle?: number | string | null;
	engine_hours?: string | number | null;
	fuel_consumption?: number | string | null;
	top_speed?: number | string | null;
	items?: Array<{
		device_id?: number | null;
		item_id?: string | null;
		time?: string | null;
		raw_time?: string | null;
		altitude?: number | null;
		lat?: number | null;
		lng?: number | null;
		distance?: number | string | null;
		other?: string | null;
		color?: string | null;
		valid?: number | null;
		sensors_data?: Array<{
			id?: string | null;
			name?: string | null;
			value?: number | string | null;
			unit?: string | null;
		}> | null;
	}> | null;
};

export type SumResult = {
	time: string;
	distance: number;
	time_seconds: number;
	engine_idle: number;
	engine_hours: string;
	count: number;
	area_m2: number;
};

function toNumber(value: unknown): number {
	if (value == null) return 0;
	if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
	const asString = String(value).trim();
	if (asString.length === 0) return 0;
	const numeric = Number(asString);
	return Number.isFinite(numeric) ? numeric : 0;
}

function parseDurationToSeconds(value: unknown): number {
	if (value == null) return 0;
	if (typeof value === 'number' && Number.isFinite(value)) {
		// interpret as hours if it's a large number without units? Better: assume seconds only when explicitly provided elsewhere.
		// Here we keep generic: if input is number, assume it's already seconds if it's an integer and small; otherwise treat as hours? That can be error-prone.
		// For safety, treat number as seconds.
		return Math.round(value);
	}
	const text = String(value);
	let hours = 0;
	let minutes = 0;
	let seconds = 0;
	const hMatch = text.match(/(\d+(?:\.\d+)?)\s*h/);
	if (hMatch) hours = parseFloat(hMatch[1]);
	const mMatch = text.match(/(\d+(?:\.\d+)?)\s*min/);
	if (mMatch) minutes = parseFloat(mMatch[1]);
	const sMatch = text.match(/(\d+(?:\.\d+)?)\s*s/);
	if (sMatch) seconds = parseFloat(sMatch[1]);
	return Math.round(hours * 3600 + minutes * 60 + seconds);
}

function formatSeconds(totalSeconds: number): string {
	const total = Math.max(0, Math.round(totalSeconds));
	const h = Math.floor(total / 3600);
	const m = Math.floor((total % 3600) / 60);
	const s = total % 60;
	const parts: string[] = [];
	if (h) parts.push(`${h}h`);
	if (m) parts.push(`${m}min`);
	if (s || parts.length === 0) parts.push(`${s}s`);
	return parts.join(' ');
}

function hasSensor39Positive(mainItem: MainItem): boolean {
	if (!mainItem?.items || mainItem.items.length === 0) return false;
	for (const sub of mainItem.items) {
		const sensors = sub?.sensors_data || [];
		for (const sensor of sensors || []) {
			if ((sensor?.id === 'sensor_39') && toNumber(sensor?.value) > 0) {
				return true;
			}
		}
	}
	return false;
}

export function sumMainItemsFilteredBySensor39(main_items: MainItem[]): SumResult {
	const filtered = (Array.isArray(main_items) ? main_items : []).filter(hasSensor39Positive);

	let totalDistance = 0;
	let totalTimeSecondsField = 0;
	let totalEngineIdle = 0;
	let totalTimeSecondsFromTime = 0;
	let totalEngineHoursSeconds = 0;

	// Collect all GPS points from filtered items
	const points: Array<{ lat: number; lng: number }> = [];

	for (const item of filtered) {
		totalDistance += toNumber(item?.distance);
		totalTimeSecondsField += toNumber(item?.time_seconds);
		totalEngineIdle += toNumber(item?.engine_idle);
		totalTimeSecondsFromTime += parseDurationToSeconds(item?.time);
		totalEngineHoursSeconds += parseDurationToSeconds(item?.engine_hours);

		const subs = item?.items || [];
		for (const sub of subs) {
			const lat = typeof sub?.lat === 'number' ? sub.lat : toNumber(sub?.lat);
			const lng = typeof sub?.lng === 'number' ? sub.lng : toNumber(sub?.lng);
			if (Number.isFinite(lat) && Number.isFinite(lng)) {
				points.push({ lat, lng });
			}
		}
	}

	// Compute covered area (m^2) using convex hull over projected coordinates
	const area_m2 = computeAreaSquareMeters(points);

	return {
		time: formatSeconds(totalTimeSecondsFromTime),
		distance: Number(totalDistance.toFixed(6)),
		time_seconds: Math.round(totalTimeSecondsField),
		engine_idle: Number(totalEngineIdle.toFixed(6)),
		engine_hours: formatSeconds(totalEngineHoursSeconds),
		count: filtered.length,
		area_m2: Number(area_m2.toFixed(2)),
	};
}

// --- Geometry helpers (local projection + convex hull + polygon area) ---

function toRadians(value: number): number {
	return (value * Math.PI) / 180;
}

function projectToMeters(lat: number, lng: number, lat0: number): { x: number; y: number } {
	// Equirectangular projection around reference latitude lat0
	const R = 6371000; // meters
	const x = R * toRadians(lng) * Math.cos(toRadians(lat0));
	const y = R * toRadians(lat);
	return { x, y };
}

function convexHull(points: Array<{ x: number; y: number }>): Array<{ x: number; y: number }> {
	// Andrew's monotonic chain algorithm
	if (points.length <= 1) return points.slice();
	const sorted = points
		.slice()
		.sort((a, b) => (a.x === b.x ? a.y - b.y : a.x - b.x));

	const lower: Array<{ x: number; y: number }> = [];
	for (const p of sorted) {
		while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
			lower.pop();
		}
		lower.push(p);
	}

	const upper: Array<{ x: number; y: number }> = [];
	for (let i = sorted.length - 1; i >= 0; i--) {
		const p = sorted[i];
		while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
			upper.pop();
		}
		upper.push(p);
	}

	upper.pop();
	lower.pop();
	return lower.concat(upper);
}

function cross(o: { x: number; y: number }, a: { x: number; y: number }, b: { x: number; y: number }): number {
	return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

function polygonArea(points: Array<{ x: number; y: number }>): number {
	// Shoelace formula
	const n = points.length;
	if (n < 3) return 0;
	let area = 0;
	for (let i = 0; i < n; i++) {
		const j = (i + 1) % n;
		area += points[i].x * points[j].y - points[j].x * points[i].y;
	}
	return Math.abs(area / 2);
}

function computeAreaSquareMeters(pointsLL: Array<{ lat: number; lng: number }>): number {
	const pts = pointsLL.filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng));
	if (pts.length < 3) return 0;
	const lat0 = pts.reduce((acc, p) => acc + p.lat, 0) / pts.length;
	const projected = pts.map(p => projectToMeters(p.lat, p.lng, lat0));
	const hull = convexHull(projected);
	return polygonArea(hull);
}





