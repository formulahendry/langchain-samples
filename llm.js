import dotenv from 'dotenv'
dotenv.config()

import { OpenAI } from "langchain/llms/openai";

const model = new OpenAI({
    azureOpenAIApiKey: process.env.azureOpenAIApiKey,
    azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
    azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
    azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
});
const res = await model.call(
    "What would be a good company name a company that makes colorful socks?"
);
console.log(res);