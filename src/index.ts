require('dotenv').config();

import * as path from 'path';
import Stage from 'telegraf/stage';
import session from 'telegraf/session';
import TelegrafI18n from 'telegraf-i18n';
import { connect, connection } from 'mongoose';
import Telegraf, { ContextMessageUpdate } from 'telegraf';

import { logger } from './utils/logger.util';
import { startScene } from './controllers/start';

connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => logger.info('Successfull database connection'))
  .catch(err =>
    logger.error(
      'Error occurred during an attempt to establish connection with the database',
      err,
    ),
  );

connection.on('open', () => {
  const bot = new Telegraf(process.env.BOT_TOKEN);
  const stage = new Stage([startScene]);

  const i18n = new TelegrafI18n({
    defaultLanguage: 'ru',
    directory: path.resolve(__dirname, 'locales'),
    useSession: true,
    allowMissing: false,
    sessionName: 'session',
  });

  bot.use(session());
  bot.use(i18n.middleware());
  bot.use(stage.middleware());

  bot.start((ctx: ContextMessageUpdate) => ctx.scene.enter('start'));

  bot.launch();
});
