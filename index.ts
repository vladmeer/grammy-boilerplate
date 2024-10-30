import { Bot, Context, MemorySessionStorage, session } from "grammy";
import { type ChatMember } from "grammy/types";
import { chatMembers } from "@grammyjs/chat-members";
import dotenv from 'dotenv';
import { MyContext, Session } from "./source/my-context";
import { menu } from "./source/menu/index";


dotenv.config();

const token = process.env.BOT_TOKEN;
if (!token) {
	throw new Error(
		"You have to provide the bot-token from @BotFather via environment variable (BOT_TOKEN)",
	);
}
function getSessionKey(ctx: Context): string | undefined {
	return ctx.from?.id.toString();
}

const adapter = new MemorySessionStorage<ChatMember>();
// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot<MyContext>(token); // <-- put your bot token between the ""

// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.
bot.use(
	session({
		initial: (): Session => ({ method: "" }),
		getSessionKey,
	}),
);
bot.use(chatMembers(adapter));
bot.use(menu);
// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running.",{
    reply_markup: menu,
},));
// Handle other messages.
bot.on("message", (ctx) => {
    switch(ctx.session.method) {
        case "balance": {
            ctx.reply("0 sol");
            ctx.session.method = "";
            break;
        }
        case "track": {
            ctx.reply("Swap");
            ctx.session.method = "";
            break;
        }
        default: {
            ctx.reply("Trigger the menu", {
                reply_markup: menu
            });
        }
    }
});

bot.catch((error) => {
	console.error("ERROR on handling update occured", error);
});

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start({
    onStart(botInfo) {
        console.log(new Date(), "Bot starts as", botInfo.username);
    },
});