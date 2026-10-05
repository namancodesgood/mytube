const shimmerStyles = {
  shimmer: "w-full h-5 shimmer flex-grow",
  avatarShimmer: "w-16 h-14 mt-1 shimmer !rounded-full",
};

const VideoCardShimmer = () => {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="aspect-video w-full shimmer" />
      </div>
      <div className="flex gap-x-4 items-start mt-2">
        <div className={shimmerStyles.avatarShimmer}></div>
        <div className="flex flex-col gap-y-1 mt-1 w-full">
          <p className="overflow-hidden text-[1.6rem] line-clamp-2"></p>
          <div className="mt-1 w-full">
            <div className={shimmerStyles.shimmer}></div>
            <div className={`${shimmerStyles.shimmer} mt-1`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCardShimmer;
