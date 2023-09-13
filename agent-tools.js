import dotenv from 'dotenv'
dotenv.config()

import { OpenAI } from "langchain/llms/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { DynamicTool } from "langchain/tools";

export const run = async () => {
    const model = new OpenAI({
        temperature: 0,
        azureOpenAIApiKey: process.env.azureOpenAIApiKey,
        azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
        azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
        azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
    });
    const tools = [
        new DynamicTool({
            name: "FOO",
            description:
                "call this to get the value of foo. input should be an empty string.",
            func: async () => "baz",
        }),
        new DynamicTool({
            name: "BAR",
            description:
                "call this to get the value of bar. input should be an empty string.",
            func: async () => "baz1",
        }),
    ];

    const executor = await initializeAgentExecutorWithOptions(tools, model, {
        agentType: "zero-shot-react-description",
        verbose: true,
    });

    console.log("Loaded agent.");

    const input = `What is the value of foo?`;

    console.log(`Executing with input "${input}"...`);

    const result = await executor.call({ input });

    console.log(`Got output ${result.output}`);
};

run();