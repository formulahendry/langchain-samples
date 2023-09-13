import dotenv from 'dotenv'
dotenv.config()

import { Milvus } from "langchain/vectorstores/milvus";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain } from "langchain/chains";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";

// 1. Load
const loader = new PDFLoader("C:/Users/junhan.FAREAST/Downloads/semantic-kernel-1-6.pdf", {
    splitPages: false,
});
const docs = await loader.load();

// 2. Transform
const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
});
const splittedDocs = await splitter.splitDocuments(docs);
// splitter.createDocuments(["ddd"])
console.log("splittedDocs.length: " + splittedDocs.length);

// 3. Embed
const vectorStore = await Milvus.fromDocuments(
    splittedDocs,
    new OpenAIEmbeddings({
        azureOpenAIApiKey: process.env.azureOpenAIApiKey,
        azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
        azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
        azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName_Embeddings,
    }),
    {
        collectionName: "pdf",
        clientConfig: {
            address: process.env.MILVUS_URL,
            token: process.env.MILVUS_TOKEN,
        },
    }
);

// [Optional] Similarity Search
const response = await vectorStore.similaritySearch("Why do you need an AI orchestration SDK?", 3);
console.log(response);

// 4. Retrieve
const vectorStoreRetriever = vectorStore.asRetriever();

const model = new OpenAI({
    azureOpenAIApiKey: process.env.azureOpenAIApiKey,
    azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
    azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
    azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName,
});

// const chain = RetrievalQAChain.fromLLM(model, vectorStoreRetriever);
const chain = ConversationalRetrievalQAChain.fromLLM(model, vectorStoreRetriever,
    {
        memory: new BufferMemory({
            memoryKey: "chat_history", // Must be set to "chat_history"
        }),
    });

console.log("========================");

const res = await chain.call({
    question: "Why do we need an AI orchestration SDK?",
});

console.log({ res });

const followUpRes = await chain.call({
    question: "What is recommended?",
});

console.log({ followUpRes });