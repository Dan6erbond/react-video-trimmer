import { Flex, FlexProps } from "@mantine/core";
import { RefObject } from "react";

interface PreviewProps extends FlexProps {
  previewRefs: RefObject<HTMLCanvasElement>[];
}

export const Preview = ({ previewRefs, ...props }: PreviewProps) => {
  return (
    <Flex {...props}>
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
  );
};

export default Preview;
