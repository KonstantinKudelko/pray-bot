"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const telegraf_1 = require("telegraf");
const mongoose_1 = require("mongoose");
const logger_util_1 = require("./utils/logger.util");
mongoose_1.connect(process.env.DB_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => logger_util_1.logger.info('Successfull database connection'))
    .catch(err => logger_util_1.logger.error('Error occurred during an attempt to establish connection with the database', err));
mongoose_1.connection.on('open', () => {
    const bot = new telegraf_1.default(process.env.BOT_TOKEN);
    bot.start(ctx => ctx.reply('Welcome'));
    bot.launch();
});
//# sourceMappingURL=index.js.map