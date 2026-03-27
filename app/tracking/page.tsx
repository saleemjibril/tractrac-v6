import dynamic from "next/dynamic";

const VehicleTrackingMap = dynamic(
  () => import("./VehicleTrackingMap"),
  { ssr: false }
);

export default function TrackingPage() {
  return <VehicleTrackingMap />;
}
