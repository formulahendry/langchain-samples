import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const text = `Hi.\n\nI'm Harrison.\n\nHow? Are? You?\nOkay then f f f f.
This is a weird text to write, but gotta test the splittingggg some how.\n\n
Bye!\n\n-H.`;
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 20,
  chunkOverlap: 5,
});

const docOutput = await splitter.splitDocuments([
  new Document({ pageContent: text }),
]);

console.log(docOutput);