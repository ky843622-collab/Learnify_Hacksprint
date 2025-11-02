import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDn0jpTVZrniOuPd7Tr2v91FG17jQyFHGQ");

async function main() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
  const prompt = "Describe a nano banana dish in a fancy restaurant with a Gemini theme.";

  const result = await model.generateContent(prompt);
  console.log(result.response.text());
}

main().catch(console.error);
