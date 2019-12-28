import Scene from 'telegraf/scenes/base';
import { ContextMessageUpdate } from 'telegraf';

import { SCENES } from '../lib/scenes';
import { UserModel } from '../../models';
import { getMainKeyboard } from '../../lib/keyboards';

export const startScene = new Scene(SCENES.START);

startScene.enter(async ({ from, reply, i18n }: ContextMessageUpdate) => {
  const { id, language_code, first_name, last_name, username } = from;
  const user = await UserModel.findById(id);
  const { mainKeyboard } = getMainKeyboard(i18n);

  i18n.locale(language_code);

  if (user) {
    await reply(i18n.t('scenes.start.welcome_back'), mainKeyboard);
  } else {
    const newUser = new UserModel({
      _id: id,
      name: `${first_name} ${last_name}`,
      username,
      totalNeeds: 0,
      needs: [],
    });

    await newUser.save();
    await reply(i18n.t('scenes.start.welcome'), mainKeyboard);
  }
});
