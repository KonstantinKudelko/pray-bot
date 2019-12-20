import Scene from 'telegraf/scenes/base';
import { ContextMessageUpdate } from 'telegraf';

import { getLanguageKeyboard } from './helpers';

const startScene = new Scene('start');

startScene.enter((ctx: ContextMessageUpdate) => {
  return ctx.reply('Choose language / Выбери язык?', getLanguageKeyboard());
});

export { startScene };
