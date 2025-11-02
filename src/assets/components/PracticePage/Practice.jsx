import { useState, useRef, useEffect } from "react";
import "./Practice.css";
import { GoogleGenAI } from "@google/genai";
import { InferenceClient } from "@huggingface/inference";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const hfClient = new InferenceClient(import.meta.env.VITE_HF_TOKEN);

export default function Practice() {
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [displayedQuestion, setDisplayedQuestion] = useState("");
  const [animatedAnswer, setAnimatedAnswer] = useState("");
  const [qLoading, setQLoading] = useState(false);
  const [aLoading, setALoading] = useState(false);
  const [status, setStatus] = useState("");
  const [diagramStatus, setDiagramStatus] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [answered, setAnswered] = useState(false);
  const [diagramError, setDiagramError] = useState("");
  const [visibleLeft, setVisibleLeft] = useState(false);
  const [visibleRight, setVisibleRight] = useState(false);

  const answerBoxRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });

  // 🎤 Free browser text-to-speech
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  // 🧩 Fade-in animation for both sides
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === leftRef.current && entry.isIntersecting) {
            setVisibleLeft(true);
          }
          if (entry.target === rightRef.current && entry.isIntersecting) {
            setVisibleRight(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (leftRef.current) observer.observe(leftRef.current);
    if (rightRef.current) observer.observe(rightRef.current);

    return () => {
      if (leftRef.current) observer.unobserve(leftRef.current);
      if (rightRef.current) observer.unobserve(rightRef.current);
    };
  }, []);

  // 🧠 Generate Question (fixed first-char bug + speech)
  const handleGetQuestion = async () => {
    if (!topic.trim()) {
      setDisplayedQuestion("⚠️ Please enter a topic first!");
      return;
    }

    setQLoading(true);
    setDisplayedQuestion("");
    setAnswered(false);
    setImageUrl("");
    setDiagramError("");

    try {
      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate one short educational practice question about ${topic}. Keep it clear and concise.`,
      });

      const fullQ = (res.text || "❌ No question generated.").trim();
      setQuestion(fullQ);
      setDisplayedQuestion("");

      // ✅ Typing animation without missing first char
      for (let i = 0; i < fullQ.length; i++) {
        setDisplayedQuestion((prev) => prev + fullQ[i]);
        await new Promise((r) => setTimeout(r, 25));
      }

      // 🔊 Speak the question aloud once fully displayed
      speakText(fullQ);
    } catch (err) {
      console.error("Error fetching question:", err);
      setDisplayedQuestion("❌ Something went wrong. Try again!");
    } finally {
      setQLoading(false);
    }
  };

  // 🤖 Generate Answer (typing + simultaneous speech)
  const handleGetAnswer = async () => {
    if (!question || question.startsWith("⚠️") || question.startsWith("⏳"))
      return;

    setALoading(true);
    setAnimatedAnswer("");
    setAnswered(true);
    setImageUrl("");
    setStatus("");
    setDiagramStatus("");
    setDiagramError("");

    try {
      setStatus("🧠 Generating Answer...");
      await new Promise((r) => setTimeout(r, 1000));

      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Explain Answer clearly, simply and briefly for the question : ${question}`,
      });

      const cleanText = res.text
        .replace(/\*/g, "*")
        .replace(/\$/g, "$")
        .replace(/\\text\{(.*?)\}/g, "$1")
        .replace(/\\frac\{(.*?)\}\{(.*?)\}/g, "$1/$2")
        .trim();

      setStatus("");

      // 🔊 Speak answer while typing
      speakText(cleanText);

      for (let i = 0; i < cleanText.length; i++) {
        setAnimatedAnswer((prev) => prev + cleanText[i]);
        await new Promise((r) => setTimeout(r, 20));
        if (answerBoxRef.current) {
          answerBoxRef.current.scrollTop = answerBoxRef.current.scrollHeight;
        }
      }

      setDiagramStatus("🎨 Generating Diagram...");
      await generateImage(cleanText);
    } catch (err) {
      console.error("Error generating answer:", err);
      setStatus("");
      setDiagramStatus("");
      setDiagramError("❌ Something went wrong. Try again!");
    } finally {
      setALoading(false);
    }
  };

  // 🎨 Generate Image
  const generateImage = async (answerText) => {
    try {
      const promptRes = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Create a short, descriptive image prompt for an educational visual that explains this answer [must be diagrammatic, colorful, with proper labeling]: "${answerText}". Only reply with the prompt.`,
      });

      const imagePrompt = promptRes.text.trim();

      const imageBlob = await hfClient.textToImage({
        provider: "nebius",
        model: "black-forest-labs/FLUX.1-dev",
        inputs: imagePrompt,
        parameters: { num_inference_steps: 20 },
      });

      const url = URL.createObjectURL(imageBlob);
      setImageUrl(url);
      setDiagramStatus("");
      setDiagramError("");
    } catch (err) {
      console.error("Error generating image:", err);
      setDiagramStatus("");
      setDiagramError("❌ Something went wrong. Try again!");
    }
  };

  return (
    <div className="practice">
      <div className="title">
        <h1>Practice Mode</h1>
      </div>

      {/* LEFT SIDE */}
      <div
        ref={leftRef}
        className={`left fade-in-left ${visibleLeft ? "visible" : ""}`}
      >
        <div className="inputBar">
          <input
            type="text"
            placeholder="Enter topic to practice..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <button onClick={handleGetQuestion} disabled={qLoading}>
            {qLoading ? "Loading..." : "Get Question"}
          </button>
        </div>

        <div className="questionBox">
          {qLoading ? (
            <p className="gradientText">🧠 Generating Question...</p>
          ) : (
            <ReactMarkdown
              children={
                displayedQuestion || "🧩 Choose a topic to generate a question!"
              }
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            />
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        ref={rightRef}
        className={`right fade-in-right ${visibleRight ? "visible" : ""}`}
      >
        <div className="answerBox" ref={answerBoxRef}>
          {status && (
            <div className="statusBox">
              <p className="gradientText">{status}</p>
            </div>
          )}

          <ReactMarkdown
            children={animatedAnswer}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          />

          {diagramStatus && (
            <div className="statusBox diagramStatus">
              <p className="gradientText">{diagramStatus}</p>
            </div>
          )}

          {diagramError && (
            <div className="errorBox diagramError">{diagramError}</div>
          )}

          {imageUrl && (
            <div className="imageContainer">
              <img src={imageUrl} alt="Generated Diagram" />
            </div>
          )}
        </div>
      </div>

      {/* FLOATING BUTTON */}
      <button
        className="ansBtn"
        onClick={handleGetAnswer}
        disabled={
          !question ||
          qLoading ||
          aLoading ||
          answered ||
          question.startsWith("⚠️") ||
          question.startsWith("⏳")
        }
      >
        {aLoading ? "Getting Answer..." : answered ? "Answered" : "GET ANSWER"}
      </button>
    </div>
  );
}
