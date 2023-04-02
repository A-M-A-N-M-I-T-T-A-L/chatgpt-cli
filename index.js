import { Configuration, OpenAIApi } from "openai";
import * as rl from "readline-sync";
import * as dotenv from "dotenv";
dotenv.config();

const config = new Configuration({
    apiKey: `${process.env.OPENAI_API_KEY}`,
    organization: `${process.env.OPENAI_ORG_KEY}`,
});

const openai = new OpenAIApi(config);

const messages = [
    { role: "system", content: "An helpful AI that replies to user queries." },
];
let userInput = rl.question("Hi! What would you like to know?\n> ");

while (userInput !== "exit") {
    messages.push({ role: "user", content: userInput });
    try {
        const response = await openai.createChatCompletion({
            messages,
            model: "gpt-3.5-turbo",
        });

        const aiReply = response.data.choices[0].message.content;
        if (aiReply) {
            messages.push(aiReply);
            userInput = rl.question(`\n${aiReply}\n\n> `);
        } else {
            userInput = rl.question("\nNo Result Found. Please try again.\n> ");
        }
    } catch (err) {
        userInput = rl.question(`\nError ==> ${err.message}. Please try again.\n> `);
    }
}
