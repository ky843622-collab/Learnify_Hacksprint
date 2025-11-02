import { useState } from "react";
import "./PageTwo.css";
import { GoogleGenAI } from "@google/genai";
import { InferenceClient } from "@huggingface/inference";

const hfClient = new InferenceClient(import.meta.env.VITE_HF_TOKEN);

export default function PageTwo() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });

  // 🗣️ Browser Speech Function (Free + Built-in)
  const speakText = (text) => {
    if (!window.speechSynthesis) {
      console.error("SpeechSynthesis API not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel(); // Stop ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1.05;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      setAnswer("⚠️ Please type a question first!");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setImageUrl("");
      setAnswer("");
      setStatus("thinking");

      // 🧠 Generate answer
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Answer clearly, simply, and concisely: ${question}`,
      });

      const answerText =
        response.text?.trim() || "❌ Could not generate an answer. Try again!";

      await new Promise((r) => setTimeout(r, 1000));
      setStatus("");

      // ✍️ Typing animation + start speaking immediately
      const fullAnswer = "🤖 Learnify says: " + answerText;
      setAnswer("");
      speakText(answerText); // <-- start speaking right here (while typing)

      for (let i = 0; i < fullAnswer.length; i++) {
        await new Promise((r) => setTimeout(r, 20));
        setAnswer((prev) => prev + fullAnswer[i]);
      }

      // 🎨 Generate image prompt
      setStatus("generating");

      const promptResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Create a short, descriptive image prompt for an educational diagram that explains this answer: "${answerText}". Only reply with the prompt.`,
      });

      const imagePrompt = promptResponse.text?.trim() || "";
      if (!imagePrompt) throw new Error("Image prompt failed.");

      const imageBlob = await hfClient.textToImage({
        provider: "nebius",
        model: "black-forest-labs/FLUX.1-dev",
        inputs: imagePrompt,
        parameters: { num_inference_steps: 20 },
      });

      const url = URL.createObjectURL(imageBlob);
      setImageUrl(url);
      setStatus("");
    } catch (err) {
      console.error("❌ Error generating content:", err);
      window.speechSynthesis?.cancel();
      setError("❌ Something went wrong. Try again!");
      setStatus("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pageTwoContainer">
      <h1 className="pageTwoTitle">Ask Learnify AI</h1>

      <div className="askSection">
        <h2>Get Instant Answers</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Asking..." : "Ask"}
          </button>
        </form>

        <div className="answerBox">
          {status === "thinking" && (
            <div className="gradientBox">
              <span className="gradientText">🧠 Generating Answer...</span>
            </div>
          )}

          {answer && <p className="typingText">{answer}</p>}

          {status === "generating" && (
            <div className="gradientBox">
              <span className="gradientText">🎨 Generating Diagram...</span>
            </div>
          )}

          {error && <div className="errorBox">{error}</div>}

          {imageUrl && (
            <div className="imageContainer">
              <img
                src={imageUrl}
                alt="Generated visual"
                style={{
                  width: "100%",
                  borderRadius: "10px",
                  marginTop: "10px",
                  boxShadow: "0 0 10px rgba(0,191,255,0.3)",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
