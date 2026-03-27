"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/** Nigeria bounding box for Photon (minLon,minLat,maxLon,maxLat). */
const NG_BBOX = "2.57,4.27,14.69,13.89";

export type AddressAutocompleteOptions = {
  types?: string[];
  componentRestrictions?: { country?: string };
};

type PhotonFeature = {
  geometry?: { type?: string; coordinates?: [number, number] };
  properties?: Record<string, string | undefined>;
};

function buildLabel(p: Record<string, string | undefined>): string {
  const line1 = [p.housenumber, p.street].filter(Boolean).join(" ").trim();
  const line2 = [p.district || p.city || p.town, p.state, p.country]
    .filter(Boolean)
    .join(", ");
  if (line1 && line2) return `${line1}, ${line2}`;
  if (line2) return line2;
  if (p.name) return p.name;
  return "";
}

/** Shape compatible with existing Google Places handlers using .lat() / .lng(). */
export function toPlaceLikeResult(label: string, lat: number, lng: number) {
  return {
    formatted_address: label,
    geometry: {
      location: {
        lat: () => lat,
        lng: () => lng,
      },
    },
  };
}

export type AddressAutocompleteProps = {
  style?: React.CSSProperties;
  placeholder?: string;
  onChange?: (e: { currentTarget: { value: string } }) => void;
  onPlaceSelected?: (place: ReturnType<typeof toPlaceLikeResult>) => void;
  options?: AddressAutocompleteOptions;
  disabled?: boolean;
};

const MIN_CHARS = 2;
const DEBOUNCE_MS = 400;

const AddressAutocomplete = forwardRef<
  HTMLInputElement,
  AddressAutocompleteProps
>(function AddressAutocomplete(
  {
    style,
    placeholder,
    onChange,
    onPlaceSelected,
    options,
    disabled,
  },
  ref
) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<
    { label: string; lat: number; lng: number }[]
  >([]);
  const [highlight, setHighlight] = useState(0);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const country =
    (options?.componentRestrictions?.country || "ng").toLowerCase();

  const runSearch = useCallback(
    async (q: string) => {
      const trimmed = q.trim();
      if (trimmed.length < MIN_CHARS) {
        setResults([]);
        return;
      }
      abortRef.current?.abort();
      let ac: AbortController | null = new AbortController();
      abortRef.current = ac;
      setLoading(true);
      try {
        const url = new URL("https://photon.komoot.io/api/");
        url.searchParams.set("q", trimmed);
        url.searchParams.set("limit", "12");
        url.searchParams.set("lang", "en");
        if (country === "ng") {
          url.searchParams.set("bbox", NG_BBOX);
        }
        const res = await fetch(url.toString(), { signal: ac.signal });
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        const feats: PhotonFeature[] = data.features || [];
        const mapped: { label: string; lat: number; lng: number }[] = [];
        for (const f of feats) {
          if (f.geometry?.type !== "Point" || !f.geometry.coordinates) continue;
          const [lng, lat] = f.geometry.coordinates;
          const p = f.properties || {};
          if (
            country === "ng" &&
            p.countrycode &&
            p.countrycode.toLowerCase() !== "ng"
          ) {
            continue;
          }
          const label = buildLabel(p);
          if (!label || !Number.isFinite(lat) || !Number.isFinite(lng)) continue;
          mapped.push({ label, lat, lng });
        }
        if (ac && !ac.signal.aborted) {
          setResults(mapped.slice(0, 8));
          setHighlight(0);
          setOpen(mapped.length > 0);
        }
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    },
    [country]
  );

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (query.trim().length < MIN_CHARS) {
      setResults([]);
      setOpen(false);
      return;
    }
    timerRef.current = setTimeout(() => runSearch(query), DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, runSearch]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const selectItem = (item: { label: string; lat: number; lng: number }) => {
    setQuery(item.label);
    setOpen(false);
    setResults([]);
    onChange?.({ currentTarget: { value: item.label } });
    onPlaceSelected?.(toPlaceLikeResult(item.label, item.lat, item.lng));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectItem(results[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <input
        ref={ref}
        type="text"
        disabled={disabled}
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          const v = e.target.value;
          setQuery(v);
          onChange?.({ currentTarget: { value: v } });
        }}
        onKeyDown={onKeyDown}
        onFocus={() => results.length > 0 && setOpen(true)}
        autoComplete="off"
        style={{ width: "100%", boxSizing: "border-box", ...style }}
      />
      {loading && (
        <span
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 10,
            color: "#929292",
            pointerEvents: "none",
          }}
        >
          …
        </span>
      )}
      {open && results.length > 0 && (
        <ul
          style={{
            position: "absolute",
            zIndex: 2000,
            left: 0,
            right: 0,
            top: "100%",
            margin: 0,
            marginTop: 2,
            padding: 0,
            listStyle: "none",
            maxHeight: 240,
            overflowY: "auto",
            background: "#fff",
            border: "1px solid #E2E8F0",
            borderRadius: 6,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
          role="listbox"
        >
          {results.map((r, i) => (
            <li
              key={`${r.lat},${r.lng},${i}`}
              role="option"
              aria-selected={i === highlight}
              onMouseEnter={() => setHighlight(i)}
              onMouseDown={(ev) => {
                ev.preventDefault();
                selectItem(r);
              }}
              style={{
                padding: "8px 10px",
                fontSize: 12,
                cursor: "pointer",
                background: i === highlight ? "#EDF2F7" : "transparent",
                color: "#323232",
              }}
            >
              {r.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default AddressAutocomplete;
