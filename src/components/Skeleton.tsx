export default function Skeleton({
  width,
  height,
}: {
  width: number | string;
  height: number | string;
}) {
  return (
    <div className="animate-pulse bg-gray-300/30 rounded w-full h-full">.</div>
  );
}
