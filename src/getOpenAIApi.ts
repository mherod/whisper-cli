import { Configuration, OpenAIApi } from "openai";
import path from "path";
import { existsSync } from "fs";
import { readJson } from "./readJson";
import { ConfigurationParameters } from "openai/configuration";

export async function getOpenAIApi(): Promise<OpenAIApi> {
  const homeDir = process.env.HOME;
  if (!homeDir) {
    throw new Error("No home dir");
  }
  const keyPath = path.join(homeDir, ".openai-config.json");
  if (!existsSync(keyPath)) {
    throw new Error("No key");
  }
  const configParams = await readJson(keyPath);
  const openAiConfig = configParams as ConfigurationParameters;
  const configuration = new Configuration(openAiConfig);
  return new OpenAIApi(configuration);
}
