"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const telegraf_1 = require("telegraf");
const bot = new telegraf_1.default(process.env.BOT_TOKEN);
bot.start(ctx => ctx.reply('Welcome'));
bot.launch();
//# sourceMappingURL=index.js.map