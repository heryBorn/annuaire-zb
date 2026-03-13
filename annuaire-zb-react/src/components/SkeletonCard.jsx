function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden shadow bg-white animate-pulse flex flex-col">
      {/* Photo placeholder — matches MemberCard h-40 */}
      <div className="w-full h-40 bg-sand shrink-0" />

      {/* Body rows */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        {/* metier badge */}
        <div className="h-5 bg-sand rounded-full w-1/3" />
        {/* name */}
        <div className="h-4 bg-sand rounded w-3/4" />
        {/* company */}
        <div className="h-3 bg-sand rounded w-1/2" />
        {/* localisation */}
        <div className="h-3 bg-sand rounded w-2/3" />
        {/* bio lines */}
        <div className="h-3 bg-sand rounded w-full mt-1" />
        <div className="h-3 bg-sand rounded w-4/5" />
      </div>

      {/* Footer placeholder */}
      <div className="border-t border-sand px-4 py-3 flex gap-4 shrink-0">
        <div className="h-4 w-4 bg-sand rounded" />
        <div className="h-4 w-4 bg-sand rounded" />
      </div>
    </div>
  );
}

export default SkeletonCard;
