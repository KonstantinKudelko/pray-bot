require('dotenv').config();

import * as path from 'path';
import session from 'telegraf/session';
import TelegrafI18n from 'telegraf-i18n';
import TelegrafWidget from 'telegraf-widget';
import { connect, connection } from 'mongoose';
import Telegraf, { ContextMessageUpdate } from 'telegraf';

import { start } from './widgets/start';
import { logger } from './lib/logger';
import { WIDGETS } from './widgets/lib/widgets';

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
  const widgets = new TelegrafWidget([start]);

  const i18n = new TelegrafI18n({
    defaultLanguage: 'ru',
    directory: path.resolve(__dirname, 'lib/locales'),
    useSession: true,
    allowMissing: false,
    sessionName: 'session',
  });

  bot.use(session());
  bot.use(i18n.middleware());
  bot.use(widgets.middleware());

  bot.start((ctx: ContextMessageUpdate) => ctx.widget.send(WIDGETS.START));

  bot.startPolling();
});
