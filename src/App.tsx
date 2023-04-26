import { Box, TextInput } from "@mantine/core";
import { useState } from "react";
import HlsVideoTrimmer from "./HlsVideoTrimmer";
import VideoTrimmer from "./VideoTrimmer";

interface XMLHttpRequestWithMethod extends XMLHttpRequest {
  method: string;
}

function App() {
  const [hlsLiveStreamUrl, setHlsLiveStreamUrl] = useState("");
  const [streamUrl, setStreamUrl] = useState("");

  return (
    <Box component="main" p="md">
      <TextInput
        label="HLS Stream URL"
        value={hlsLiveStreamUrl}
        onChange={(e) => setHlsLiveStreamUrl(e.target.value)}
        mb="md"
      />
      {hlsLiveStreamUrl && (
        <HlsVideoTrimmer hlsLiveStreamUrl={hlsLiveStreamUrl} />
      )}
      <TextInput
        label="Stream URL"
        value={streamUrl}
        onChange={(e) => setStreamUrl(e.target.value)}
        mb="md"
      />
      {streamUrl && <VideoTrimmer streamUrl={streamUrl} />}
    </Box>
  );
}

export default App;
