// import { OpenAIApi, Configuration } from "openai";
// const { OpenAIApi, Configuration } = require("openai");
import OpenAI from "openai";

console.log(OpenAI);

// const config = new OpenAI.Configuration({
//     // organization: "org-Pbv4jzqmF8ndROVzZF1cmP2W",
//     apiKey: process.env.OPENAI_API_KEY,
// });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const openaiapi = async (req, res) => {
    if (req.body.prompt !== undefined) {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: `${req.body.prompt}` }],
            model: "gpt-3.5-turbo",
        });

        res.status(200).json({
            text: `${completion.choices[0].message.content}`,
        });
    } else {
        res.status(400).json({ text: "No prompt provided." });
    }
};

export default myApiHandler;
