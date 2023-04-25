import { Box, TextInput } from "@mantine/core";
import { useState } from "react";
import HlsVideoTrimmer from "./HlsVideoTrimmer";

function App() {
  const [hlsLiveStreamUrl, setHlsLiveStreamUrl] = useState("");

  return (
    <Box component="main" p="md">
      <TextInput
        label="HLS Stream"
        value={hlsLiveStreamUrl}
        onChange={(e) => setHlsLiveStreamUrl(e.target.value)}
        mb="md"
      />
      <HlsVideoTrimmer hlsLiveStreamUrl={hlsLiveStreamUrl} />
    </Box>
  );
}

export default App;
