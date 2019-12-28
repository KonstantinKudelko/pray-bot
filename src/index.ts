require('dotenv').config();

import * as path from 'path';
import session from 'telegraf/session';
import TelegrafI18n, { match } from 'telegraf-i18n';
import { connect, connection } from 'mongoose';
import Telegraf, { ContextMessageUpdate } from 'telegraf';

import Stage from 'telegraf/stage';

import { logger } from './lib/logger';
import { getMainKeyboard } from './lib/keyboards';
import { SCENES, startScene, createNeedScene } from './scenes';

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
  const stage = new Stage([startScene, createNeedScene]);

  const i18nTelegraf = new TelegrafI18n({
    defaultLanguage: 'ru',
    directory: path.resolve(__dirname, 'lib/locales'),
    useSession: true,
    allowMissing: false,
    sessionName: 'session',
  });

  bot.use(session());
  bot.use(i18nTelegraf.middleware());
  bot.use(stage.middleware());

  bot.start(async ({ scene }: ContextMessageUpdate) => scene.enter(SCENES.START));
  bot.hears(
    match('keyboards.main.create'),
    async ({ scene }: ContextMessageUpdate) => await scene.enter(SCENES.CREATE_NEED),
  );

  bot.hears(
    match('keyboards.back.button'),
    async ({ reply, i18n }: ContextMessageUpdate) => {
      const { mainKeyboard } = getMainKeyboard(i18n);

      await reply(i18n.t('common.middleware_message'), mainKeyboard);
    },
  );

  bot.catch((error: Error) => logger.error('Global error has happened', error));
  bot.startPolling();
});
