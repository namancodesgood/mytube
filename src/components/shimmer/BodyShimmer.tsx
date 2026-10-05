import VideoCardShimmer from "./VideoCardShimmer";

const repetitions = Array.from({ length: 12 });

const BodyShimmer = () => {
  return (
    <div className="video-grid">
      {repetitions.map((_, idx) => (
        <VideoCardShimmer key={idx} />
      ))}
    </div>
  );
};

export default BodyShimmer;
