import Scene from 'telegraf/scenes/base';
import tzlookup from 'tz-lookup';
import { ContextMessageUpdate } from 'telegraf';

import { SCENES } from '../lib/constants';
import { UserModel } from '../../models';
import { setReminder } from './lib/set-reminder';
import { getBackKeyboard, getMainKeyboard } from '../../lib/keyboards';

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

    await reply(`${i18n.t('scenes.remind.success_timezone')} ${timezone} 📍`);
    await reply(i18n.t('scenes.remind.set_time'), backKeyboard);
  },
);

remindScene.hears(
  /\d+:\d+/,
  async ({ i18n, from, reply, match }: ContextMessageUpdate) => {
    const { id } = from;
    const time = match[0];
    const { mainKeyboard } = getMainKeyboard(i18n);
    const splittedTime = time.split(':');
    const hour = splittedTime[0];
    const minute = splittedTime[1];
    const cron = `${minute} ${hour} * * *`;

    const { timezone } = await UserModel.findByIdAndUpdate(
      {
        _id: id.toString(),
      },
      {
        $set: { cron },
      },
      { new: true },
    );

    await setReminder(id.toString(), i18n, cron, timezone);

    await reply(
      `${i18n.t('scenes.remind.reminder_info')} \n${i18n.t(
        'common.time',
      )} ${time} \n${i18n.t('common.timezone')} ${timezone} `,
      mainKeyboard,
    );
  },
);
