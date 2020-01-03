import * as path from 'path';
import session from 'telegraf/session';
import TelegrafI18n, { match } from 'telegraf-i18n';
import { connect, connection } from 'mongoose';
import { ContextMessageUpdate } from 'telegraf';

import Stage from 'telegraf/stage';

import { bot } from './bot';
import { logger } from './lib/logger';
import { getMainKeyboard } from './lib/keyboards';
import {
  SCENES,
  startScene,
  remindScene,
  listNeedScene,
  createNeedScene,
} from './scenes';

connect(process.env.DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useFindAndModify: false,
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
  const stage = new Stage([startScene, listNeedScene, remindScene, createNeedScene]);

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
    match('keyboards.main.list_needs'),
    async ({ scene }: ContextMessageUpdate) => await scene.enter(SCENES.LIST_NEED),
  );
  bot.hears(
    match('keyboards.main.remind'),
    async ({ scene }: ContextMessageUpdate) => await scene.enter(SCENES.REMIND),
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
