// Same shape as VideoCard: 16:9 thumbnail, round avatar, two title lines, one meta line
const VideoCardShimmer = () => {
  return (
    <div className="flex flex-col gap-[1.2rem]">
      <div className="aspect-video w-full rounded-xl shimmer" />
      <div className="flex gap-[1.2rem]">
        <div className="w-[3.6rem] h-[3.6rem] shrink-0 rounded-full shimmer" />
        <div className="flex flex-col gap-[0.8rem] w-full pt-[0.2rem]">
          <div className="h-[1.6rem] w-[90%] rounded shimmer" />
          <div className="h-[1.6rem] w-[60%] rounded shimmer" />
          <div className="h-[1.4rem] w-[40%] rounded shimmer mt-[0.4rem]" />
        </div>
      </div>
    </div>
  );
};

export default VideoCardShimmer;
