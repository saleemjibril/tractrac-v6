import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

let didSetOptions = false;

function ensureOptions() {
  if (didSetOptions) return;
  didSetOptions = true;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  setOptions({
    apiKey,
    version: "weekly",
    libraries: ["places", "geometry", "marker"],
  });
}

export async function importGoogleLibrary<T = unknown>(name: string): Promise<T> {
  ensureOptions();
  return (await importLibrary(name as any)) as T;
}

export async function preloadGoogleMaps() {
  await importGoogleLibrary("maps");
  await importGoogleLibrary("places");
  await importGoogleLibrary("geometry");
  await importGoogleLibrary("marker");
}

const googleMapsLoader = {
  importLibrary: importGoogleLibrary,
  preload: preloadGoogleMaps,
};

export default googleMapsLoader;