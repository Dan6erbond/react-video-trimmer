import { Box } from "@mantine/core";
import { useResizeObserver } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import ReactHlsPlayer from "react-hls-player";
import Trimmer from "./Trimmer";
import { useTimeline } from "./hooks/useTimeline";

interface VideoTrimmerProps {
  streamUrl: string;
}

const VideoTrimmer = ({ streamUrl }: VideoTrimmerProps) => {
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
      <video
        src={streamUrl}
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
        ref={thumbnailRef}
      />
      <video
        src={streamUrl}
        autoPlay={false}
        controls
        width="100%"
        style={{
          maxHeight: "70vh",
        }}
        ref={videoRef}
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

export default VideoTrimmer;
