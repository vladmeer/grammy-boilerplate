import { Menu } from "@grammyjs/menu";

export const menu = new Menu("raid-bot-menu")
	.text("Get Balance", (ctx: any) => {
		ctx.session.method = "balance";
		ctx.reply("Input the wallet address");
	})
	.text("Track", async (ctx: any) => {
		ctx.session.method = "track";
		ctx.reply("Input the tx signature")
	});
