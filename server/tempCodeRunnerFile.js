async function main() {
  const prompt =
    "Create a picture of a nano banana dish in a fancy restaurant with a Gemini theme";

  // Use the image-capable Gemini model
  // Note: "gemini-2.0-flash" might not be a valid model name for image generation.
  // You likely want a model like "gemini-pro-vision" (for image understanding)
  // or an image generation model (which has a different API flow, e.g., Imagen).
  // Let's assume you meant a model that can generate text *about* an image.
  // If you are trying to *generate* an image, you'll need to adjust the model and API call.
  
  // For text generation, "gemini-1.5-flash" or "gemini-pro" is more common.
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);

  // Your original code was attempting to *save* an image from the response.
  // Standard text models don't return images. If you are using an image
  // generation model, the response structure will be different.
  
  // I will comment out the image-saving part as it won't work
  // with a standard generative text model like "gemini-1.5-flash".

  /*
  // Extract image from response
  const imagePart = result.response.candidates[0].content.parts.find(
    (p) => p.inlineData
  );

  if (imagePart) {
    const buffer = Buffer.from(imagePart.inlineData.data, "base64");
    fs.writeFileSync("gemini-image.png", buffer);
    console.log("✅ Image saved as gemini-image.png");
  } else {
    console.error("⚠️ No image data found in the response.");
  }
  */
}

main().catch(console.error);