import { ActionIcon, Box, Flex, RangeSlider } from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";
import React, { RefObject, useEffect, useRef, useState } from "react";
import ReactHlsPlayer from "react-hls-player";

interface HlsVideoTrimmerProps {
  hlsLiveStreamUrl: string;
}

function HlsVideoTrimmer({ hlsLiveStreamUrl }: HlsVideoTrimmerProps) {
  const thumbnailRef = useRef<HTMLVideoElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const [previewRefs, setPreviewRefs] = useState<
    RefObject<HTMLCanvasElement>[]
  >([]);
  const [duration, setDuration] = useState(0);
  const [rangeValue, setRangeValue] = useState<[number, number]>([0, 0]);
  const [sliderWidth, setSliderWidth] = useState(0);

  const [start, end] = rangeValue;

  useEffect(() => {
    videoRef.current && (videoRef.current.currentTime = start);
  }, [start]);

  useEffect(() => {
    videoRef.current && (videoRef.current.currentTime = end);
  }, [end]);

  useEffect(() => {
    if (!sliderRef.current) return;

    const resize = () => {
      setSliderWidth(sliderRef.current!.clientWidth);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(sliderRef.current);

    return () => observer.disconnect();
  });

  useEffect(() => {
    setPreviewRefs(
      Array.from(
        {
          length: Math.ceil(sliderWidth / (40 * (16 / 9))),
        },
        () => React.createRef<HTMLCanvasElement>()
      )
    );
  }, [sliderWidth, setPreviewRefs]);

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.onloadedmetadata = () => {
      setDuration(videoRef.current?.duration || 0);
      setRangeValue([0, videoRef.current?.duration || 0]);
    };
  }, [videoRef, setDuration]);

  useEffect(() => {
    if (!thumbnailRef.current) return;

    thumbnailRef.current.onloadedmetadata = () => {
      const numPreviews = Math.ceil(
        sliderRef.current!.clientWidth / (40 * (16 / 9))
      );

      const drawTimeline = async () => {
        for (let i = 0; i < previewRefs.length; i++) {
          const seekedPromise = new Promise<void>((resolve) => {
            const onSeeked = () => {
              const ref = previewRefs[i];
              const ctx = ref.current?.getContext("2d");
              ctx?.drawImage(
                thumbnailRef.current!,
                0,
                0,
                ctx.canvas.width,
                ctx.canvas.height
              );
              thumbnailRef.current!.removeEventListener("seeked", onSeeked);
              resolve();
            };
            thumbnailRef.current!.addEventListener("seeked", onSeeked);
          });

          thumbnailRef.current!.currentTime =
            (i / numPreviews) * thumbnailRef.current!.duration;

          await seekedPromise;
        }
      };

      requestAnimationFrame(drawTimeline);
    };
  }, [thumbnailRef, previewRefs]);

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
        controls={false}
        width="100%"
        style={{
          maxHeight: "70vh",
        }}
        playerRef={videoRef}
      />
      <Box pos="absolute" bottom={0} left={0} right={0} mb={8} px={6}>
        <Flex align="center" gap="sm">
          <ActionIcon variant="subtle" radius="xl">
            <IconPlayerPlay />
          </ActionIcon>
          <Box
            pos="relative"
            bottom={0}
            left={0}
            right={0}
            sx={{ flex: 1 }}
            h={40}
          >
            <Flex
              pos="absolute"
              bottom={0}
              left={0}
              right={0}
              wrap="nowrap"
              sx={{ overflow: "hidden" }}
              align="stretch"
              h={40}
            >
              {previewRefs.map((ref, idx) => (
                <canvas
                  height={40}
                  width={40 * (16 / 9)}
                  ref={ref}
                  key={idx}
                  style={{ flex: 1 }}
                />
              ))}
            </Flex>
            <RangeSlider
              h={40}
              step={1}
              max={duration}
              minRange={1}
              showLabelOnHover={false}
              radius="xs"
              color="indigo"
              value={rangeValue}
              onChange={setRangeValue}
              label={(value) =>
                `${Intl.NumberFormat([], {
                  minimumIntegerDigits: 2,
                }).format(Math.floor(value / 60))}:${Intl.NumberFormat([], {
                  minimumIntegerDigits: 2,
                }).format(Math.round(value % 60))}`
              }
              styles={{
                thumb: { height: 40 },
                track: {
                  "::before": { backgroundColor: "unset" },
                },
                bar: { backgroundColor: "unset" },
              }}
              ref={sliderRef}
              pos="absolute"
              left={0}
              right={0}
              top={0}
            />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

export default HlsVideoTrimmer;
