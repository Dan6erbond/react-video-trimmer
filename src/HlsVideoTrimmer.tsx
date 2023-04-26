import { Box } from "@mantine/core";
import { useResizeObserver } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import ReactHlsPlayer from "react-hls-player";
import Trimmer from "./Trimmer";
import { useTimeline } from "./hooks/useTimeline";

interface HlsVideoTrimmerProps {
  hlsLiveStreamUrl: string;
}

const HlsVideoTrimmer = ({ hlsLiveStreamUrl }: HlsVideoTrimmerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const [rangeValue, setRangeValue] = useState<[number, number]>([0, 0]);
  const [trimmerRef, trimmerRect] = useResizeObserver();

  const { thumbnailRef, previewRefs } = useTimeline({
    sliderWidth: trimmerRect.width,
  });

  const [start, end] = rangeValue;

  useEffect(() => {
    videoRef.current && (videoRef.current.currentTime = start);
  }, [start]);

  useEffect(() => {
    videoRef.current && (videoRef.current.currentTime = end);
  }, [end]);

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.onloadedmetadata = () => {
      setDuration(videoRef.current?.duration || 0);
      setRangeValue([0, videoRef.current?.duration || 0]);
    };
  }, [videoRef, setDuration]);

  return (
    <Box pos="relative">
      <ReactHlsPlayer
        src={hlsLiveStreamUrl}
        autoPlay={false}
        controls={false}
        width="100%"
        style={{
          maxHeight: "70vh",
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: -10,
        }}
        playerRef={thumbnailRef}
      />
      <ReactHlsPlayer
        src={hlsLiveStreamUrl}
        autoPlay={false}
        controls
        width="100%"
        style={{
          maxHeight: "70vh",
        }}
        playerRef={videoRef}
      />
      <Trimmer
        duration={duration}
        value={rangeValue}
        onChange={setRangeValue}
        previewRefs={previewRefs}
        ref={trimmerRef}
      />
    </Box>
  );
};

export default HlsVideoTrimmer;
