import dotenv from 'dotenv'
dotenv.config()

import { Milvus } from "langchain/vectorstores/milvus";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { SerpAPI, ChainTool } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { initializeAgentExecutorWithOptions } from "langchain/agents";


const vectorStore = await Milvus.fromExistingCollection(
    new OpenAIEmbeddings({
        azureOpenAIApiKey: process.env.azureOpenAIApiKey,
        azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
        azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
        azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName_Embeddings,
    }),
    {
        collectionName: "pdf_0823",
        clientConfig: {
            address: process.env.MILVUS_URL,
            token: process.env.MILVUS_TOKEN,
        },
    }
);

const vectorStoreRetriever = vectorStore.asRetriever();

const model = new OpenAI({
    azureOpenAIApiKey: process.env.azureOpenAIApiKey,
    azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
    azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
    azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
});

// ---------------------

const chain = ConversationalRetrievalQAChain.fromLLM(model, vectorStoreRetriever,
    {
        memory: new BufferMemory({
            memoryKey: "chat_history", // Must be set to "chat_history"
        }),
    });

const qaTool = new ChainTool({
    name: "sk-qa",
    description:
        "Semantic Kernel and AI QA - useful for when you need to ask questions about Semantic Kernel and AI.",
    chain: chain,
});

const tools = [
    new Calculator(),
    qaTool,
];

const executor = await initializeAgentExecutorWithOptions(tools, model, {
    agentType: "chat-conversational-react-description",
});

const result = await executor.call({ input: "What is Semantic Kernel?" });

console.log(`Got output: ${result.output}`);

// const result = await executor.call({ input: "Why is AI SDK needed?" });

// console.log(`Got output: ${result.output}`);

// const result2 = await executor.call({ input: "What is recommended? And what is the value of 2+2?" });

// console.log(`Got output 2: ${result2.output}`);