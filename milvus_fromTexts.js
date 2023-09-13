import dotenv from 'dotenv'
dotenv.config()

import { Milvus } from "langchain/vectorstores/milvus";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

// text sample from Godel, Escher, Bach
const vectorStore = await Milvus.fromTexts(
    [
        "Tortoise: Labyrinth? Labyrinth? Could it Are we in the notorious Little\
            Harmonic Labyrinth of the dreaded Majotaur?",
        "Achilles: Yiikes! What is that?",
        "Tortoise: They say-although I person never believed it myself-that an I\
            Majotaur has created a tiny labyrinth sits in a pit in the middle of\
            it, waiting innocent victims to get lost in its fears complexity.\
            Then, when they wander and dazed into the center, he laughs and\
            laughs at them-so hard, that he laughs them to death!",
        "Achilles: Oh, no!",
        "Tortoise: But it's only a myth. Courage, Achilles.",
    ],
    [{ id: 2 }, { id: 1 }, { id: 3 }, { id: 4 }, { id: 5 }],
    new OpenAIEmbeddings({
        azureOpenAIApiKey: process.env.azureOpenAIApiKey,
        azureOpenAIApiVersion: process.env.azureOpenAIApiVersion,
        azureOpenAIApiInstanceName: process.env.azureOpenAIApiInstanceName,
        azureOpenAIApiDeploymentName: process.env.azureOpenAIApiDeploymentName_Embeddings,
    }),
    {
        collectionName: "goldel_escher_bach",
        clientConfig: {
            address: process.env.MILVUS_URL,
            token: process.env.MILVUS_TOKEN,
        },
    }
);

const response = await vectorStore.similaritySearch("scared", 3);

console.log(response);