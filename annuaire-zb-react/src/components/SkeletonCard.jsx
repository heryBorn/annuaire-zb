function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden shadow bg-white animate-pulse">
      {/* Square image placeholder — must match MemberCard photo block exactly */}
      <div className="w-full aspect-square bg-sand" />

      {/* Text rows — must match MemberCard info section structure */}
      <div className="p-4 space-y-2">
        {/* name row */}
        <div className="h-4 bg-sand rounded w-3/4" />
        {/* title row */}
        <div className="h-3 bg-sand rounded w-1/2" />
        {/* company row */}
        <div className="h-3 bg-sand rounded w-2/3" />
        {/* badge row */}
        <div className="h-5 bg-sand rounded-full w-1/3 mt-3" />
      </div>
    </div>
  );
}

export default SkeletonCard;
