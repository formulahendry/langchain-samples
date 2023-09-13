import dotenv from 'dotenv'
dotenv.config()

import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";

const model = new ChatOpenAI({
    temperature: 0.9,
    azureOpenAIApiKey: process.env.azureOpenAIApiKey,
    azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
    azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
    azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName_35,
});

const response = await model.call([
    new HumanMessage(
        "What is a good name for a company that makes colorful socks?"
    ),
]);
console.log(response);