import * as path from 'path';

require('dotenv').config({ path: path.join(__dirname, '../.env') });

import Telegraf from 'telegraf';

export const bot = new Telegraf(process.env.BOT_TOKEN);
