import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const endpoint = "https://DeepSeek-R1-bnkve.eastus.models.ai.azure.com";
const modelName = "DeepSeek-R1-bnkve";

export async function main() {
  const aiHubKey = process.env.AI_HUB_KEY;
  if (!aiHubKey) {
    throw new Error("Environment variable AI_HUB_KEY is not defined.");
  }
  const credential = new AzureKeyCredential(aiHubKey);
  const client = ModelClient(endpoint, credential, { apiVersion: "2024-05-01-preview" });

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { role:"system", content: "You are a helpful assistant." },
        { role:"user", content: "Why is the sky blue?" }
      ],
      max_tokens: 2048,
      model: modelName
    }
  });

  if (response.status !== "200") {
    if ("error" in response.body) {
      throw response.body.error;
    } else {
      throw new Error("An unknown error occurred.");
    }
  }
  if ("choices" in response.body) {
    console.log(response.body.choices[0].message.content);
  } else {
    throw new Error("Unexpected response format.");
  }
}

main().catch((err) => {
  console.error("The sample encountered an error:", err);
});