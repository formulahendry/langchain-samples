import dotenv from 'dotenv'
dotenv.config()

import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { OpenAI } from "langchain/llms/openai";
import { WikipediaQueryRun } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";

const model = new OpenAI({
    temperature: 0,
    azureOpenAIApiKey: process.env.azureOpenAIApiKey,
    azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
    azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
    azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
});
const tools = [
    new WikipediaQueryRun(),
    new Calculator(),
];

const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "zero-shot-react-description",
    verbose: true,
});

const input = `How many years is the President of United States older than the President of France?`;

const result = await executor.call({ input });

console.log(`Got output ${result.output}`);