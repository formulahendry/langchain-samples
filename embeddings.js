import dotenv from 'dotenv'
dotenv.config()

import { OpenAIEmbeddings } from "langchain/embeddings/openai";

/* Create instance */
const embeddings = new OpenAIEmbeddings({
    azureOpenAIApiKey: process.env.azureOpenAIApiKey,
    azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
    azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
    azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName_Embeddings,
});

/* Embed queries */
const res = await embeddings.embedQuery("Hello world");

console.log(res);