import { ContextMessageUpdate } from 'telegraf';

import { Widget } from '../../lib/telegraf-widget';
import { WIDGETS } from '../lib/widgets';
import { getMainKeyboard } from '../../lib/main-keyboard';

const START_COMMANDS = Object.freeze({
  INIT: 'init',
});

const start = new Widget(WIDGETS.START, START_COMMANDS.INIT);

start.on(START_COMMANDS.INIT, async ({ from, i18n, reply }: ContextMessageUpdate) => {
  const { language_code } = from;
  const { mainKeyboard } = getMainKeyboard();

  i18n.locale(language_code);

  await reply(i18n.t('widgets.start.welcome'), mainKeyboard);
});

export { start };
