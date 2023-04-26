import React, { RefObject, useEffect, useRef, useState } from "react";

interface UseTimelineOptions {
  sliderWidth: number;
}

export const useTimeline = ({ sliderWidth }: UseTimelineOptions) => {
  const thumbnailRef = useRef<HTMLVideoElement>(null);
  const [previewRefs, setPreviewRefs] = useState<
    RefObject<HTMLCanvasElement>[]
  >([]);

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
    if (!thumbnailRef.current) return;

    thumbnailRef.current.onloadedmetadata = () => {
      const numPreviews = Math.ceil(sliderWidth / (40 * (16 / 9)));

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
  }, [thumbnailRef, previewRefs, sliderWidth]);

  return { thumbnailRef, previewRefs };
};
