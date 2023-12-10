import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY not found in environment");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function translateJson(json: string) {
  const prompt = `Translate the following JSON into italian.
  Only translate the values, not the keys
   Just return the json and nothing else:
   For example:
    {
      "key1": "value1",
      "key2": "value2"
    }
  should be translated to:
    {
      "key1": "valore1",
      "key2": "valore2"
    }
  \n  
  \n
  ${json}
`;

  const params: OpenAI.Completions.CompletionCreateParamsNonStreaming = {
    model: "gpt-3.5-turbo-instruct",
    prompt,
    temperature: 1,
    max_tokens: 3400,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };

  const response = await openai.completions.create(params);

  return response.choices[0].text;
}

export default translateJson;
