import { Box, BoxProps, Flex, Group, RangeSlider, Text } from "@mantine/core";
import React, { RefObject } from "react";
import Preview from "./Preview";
import { formatDuration } from "./utils/formatDuration";

interface TrimmerProps extends BoxProps {
  previewRefs: RefObject<HTMLCanvasElement>[];
  duration: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const Trimmer = React.forwardRef<HTMLDivElement, TrimmerProps>(
  ({ previewRefs, duration, value, onChange, ...props }, ref) => {
    return (
      <Box {...props} ref={ref} pos="relative">
        <Preview
          previewRefs={previewRefs}
          pos="absolute"
          top={0}
          bottom={0}
          left={0}
          right={0}
          wrap="nowrap"
          sx={{ overflow: "hidden" }}
          align="stretch"
          h={40}
        />
        <RangeSlider
          h={40}
          w="100%"
          step={1}
          max={duration}
          minRange={1}
          showLabelOnHover={false}
          radius="xs"
          color="indigo"
          value={value}
          onChange={onChange}
          label={formatDuration}
          styles={{
            thumb: { height: 40 },
            track: {
              "::before": { backgroundColor: "unset" },
            },
            bar: { backgroundColor: "unset" },
          }}
        />
        <Group sx={{ justifyContent: "end" }}>
          <Text>{formatDuration(value[1] - value[0])}</Text>
        </Group>
      </Box>
    );
  }
);

export default Trimmer;
