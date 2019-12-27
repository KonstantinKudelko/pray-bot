import { ContextMessageUpdate } from 'telegraf';

import { Widget } from '../../lib/telegraf-widget';
import { WIDGETS } from '../lib/widgets';
import { getMainKeyboard } from '../../lib/main-keyboard';
import { UserModel } from '../../models/user.model';

const START_COMMANDS = Object.freeze({
  INIT: 'init',
});

const start = new Widget(WIDGETS.START, START_COMMANDS.INIT);

start.on(START_COMMANDS.INIT, async ({ from, i18n, reply }: ContextMessageUpdate) => {
  const { id, language_code, first_name, last_name, username } = from;
  const user = await UserModel.findById(id);
  const { mainKeyboard } = getMainKeyboard();

  i18n.locale(language_code);

  if (user) {
    await reply(i18n.t('widgets.start.welcome_back'), mainKeyboard);
  } else {
    const newUser = new UserModel({
      _id: id,
      name: `${first_name} ${last_name}`,
      username,
      totalNeeds: 0,
      needs: [],
    });

    await newUser.save();
    await reply(i18n.t('widgets.start.welcome'), mainKeyboard);
  }
});

export { start };
