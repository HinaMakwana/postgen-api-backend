const { openai, MODAL_TYPE } = require("../../../config/constants");
const { chatgptTexttoText } = require("../model/chatgptTextToText");
const { groqTextToText } = require("../model/groqTextToText");
const systemPrompt = `You are a helpful assistant. Your job is to take user input and detect news keywords, tone, platform name, content type, search engine (if mentioned), news source (if mentioned), other user preferences (if mentioned) of the content to be generated and return a JSON object. The news keywords will be used for fetching relevant news articles and doing further research. If there are multiple news keywords, tone, platforms, content types or other preferences, make them comma-separated. If user does not mention the tone, identify the tone based on the given input. If user does not mention name of the platform, keep it blank. Only choose from the below constraints for tone, platforms and format.
Title: Generate a short title based on user prompt.
Tone: [Informative, Educative, Humorous, Funny, Meme, Serious, Professional, Concerning, Exciting]
Platform: [LinkedIn, Instagram, X, Facebook, Reddit]
Format: [Text, Image, Video, Meme]
In case of previous prompt is present, check if the converstation is flowing from the previous prompt or it's a totally new conversation. Set context-changed to true if the conversation is in different context. Otherwise always set it to false.
Do not give any other details, just the required data as per the following structure.
Example:
User: Create a humorous post about AI replacing jobs for a Twitter audience
Output:
{
"news": "ai-replacing-jobs",
"title": "Job replacement by AI",
"tone": "humorous",
"platform": "twitter",
"content_type": "text",
"preferences": "",
"search_engine": "",
"source": ""
"context-changed": 'false'
}
User: Create an informative post not exceeding 160 characters with image about india-australia cricket match for a LinkedIn audience
Output:
{
"news": "india-australia-cricket-match",
"title": "india-australia cricket match",
"tone": "informative",
"platform": "linkedin",
"content_type": "text, image",
"preferences": "not exceeding 160 characters",
"search_engine": "",
"source": "",
"context-changed": 'false'
}
User: Crawl using google to create a post about recent football match of real madrid for a  audience referring to news from BBC. , Previous Prompt: 'Write an article about financial fraud of 1992'
Output:
{
"news": "india-australia-cricket-match",
"title": "Recent football match of real Madrid"
"tone": "informative",
"platform": "",
"content_type": "text, image",
"preferences": "not exceeding 160 characters",
"search_engine": "google",
"source": "bbc",
"context-changed": 'true'
}
you must check before sending output must be  prefectly JSON stringify object and check output with JSON.parse function. You send perfectly JSON stringify object which parse successfully.
`;

async function generateKeywords(query, type = MODAL_TYPE.GROQ) {
  let messageData = [
    {
      role: "system",
      content: systemPrompt,
    },
    { role: "user", content: `${query}` },
  ];
  try {
    let response;
    if (type == MODAL_TYPE.GROQ) {
      response = await groqTextToText(messageData);
    } else {
      response = await chatgptTexttoText(messageData);
    }

    return response;
  } catch (error) {
    console.error("Error generating keywords:", error.message);
    return null;
  }
}

module.exports = { generateKeywords };
