import { useState } from "react";
import "./VideoGenerator.css";

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateVideo = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt first!");
      return;
    }

    setError("");
    setLoading(true);
    setVideoUrl("");

    try {
      const endpointUrl = "https://modelslab.com/api/v7/video-fusion/text-to-video";

      const requestBody = {
        prompt,
        model_id: "seedance-t2v",
        aspect_ratio: "16:9",
        resolution: "720p",
        camera_fixed: false,
        key: "vsY4gKVFi9Vch9iko2cj1PGkGaIKj93v8HQMK2Iqg4LCq7nmGvmK29q3caXu",
      };

      const response = await fetch(endpointUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(
          `API Error (${response.status}): ${data.error?.message || response.statusText}`
        );
      }

      // ✅ Try to extract video URL from various response formats
      const videoUrl =
        data.video_url ||
        data.output_url ||
        data.url ||
        data.video ||
        (data.output && data.output[0]) ||
        (data.data && data.data.video);

      if (videoUrl) {
        setVideoUrl(videoUrl);
      } else if (data.id) {
        // 🕓 Handle async job: poll until video is ready
        await pollForVideo(data.id);
      } else {
        throw new Error("No video URL returned from API.");
      }
    } catch (err) {
      console.error("Error generating video:", err);
      setError(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Polling if API returns a job ID instead of direct URL
  const pollForVideo = async (jobId) => {
    try {
      const statusUrl = `https://modelslab.com/api/v7/video-fusion/fetch/${jobId}`;
      let videoReady = false;
      let attempts = 0;

      while (!videoReady && attempts < 15) {
        await new Promise((r) => setTimeout(r, 5000)); // wait 5 sec between checks

        const checkResponse = await fetch(statusUrl, {
          headers: { "Content-Type": "application/json" },
        });
        const statusData = await checkResponse.json();
        console.log("Polling result:", statusData);

        const readyUrl =
          statusData.video_url ||
          statusData.url ||
          (statusData.output && statusData.output[0]);

        if (readyUrl) {
          setVideoUrl(readyUrl);
          videoReady = true;
          break;
        }

        attempts++;
      }

      if (!videoReady) {
        throw new Error("Video generation took too long. Try again later.");
      }
    } catch (err) {
      console.error("Error polling for video:", err);
      setError("Failed to fetch the generated video.");
    }
  };

  return (
    <div className="video-generator">
      <h1>🎬 AI Video Generator</h1>

      <div className="input-area">
        <textarea
          placeholder="Enter your video idea prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button onClick={generateVideo} disabled={loading}>
          {loading ? "Generating..." : "Generate Video"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {videoUrl && (
        <div className="video-container">
          <video src={videoUrl} controls autoPlay loop></video>
        </div>
      )}
    </div>
  );
}
