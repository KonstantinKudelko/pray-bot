import Scene from 'telegraf/scenes/base';
import tzlookup from 'tz-lookup';
import { ContextMessageUpdate } from 'telegraf';

import { SCENES } from '../lib/constants';
import { UserModel } from '../../models';
import { getBackKeyboard } from '../../lib/keyboards';

export const remindScene = new Scene(SCENES.REMIND);

remindScene.enter(async ({ reply, i18n }: ContextMessageUpdate) => {
  const { backKeyboard } = getBackKeyboard(i18n);

  await reply(i18n.t('scenes.remind.welcome'), backKeyboard);
});

remindScene.on(
  'location',
  async ({ i18n, from, reply, message }: ContextMessageUpdate) => {
    const { id } = from;
    const { location } = message;
    const { latitude, longitude } = location;
    const timezone = tzlookup(latitude, longitude);
    const { backKeyboard } = getBackKeyboard(i18n);

    await UserModel.findByIdAndUpdate(
      {
        _id: id.toString(),
      },
      {
        $set: { timezone },
      },
    );

    await reply(
      `${i18n.t('scenes.remind.success_timezone')} ${timezone} 📍`,
      backKeyboard,
    );
  },
);
