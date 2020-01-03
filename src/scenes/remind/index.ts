import Scene from 'telegraf/scenes/base';
import schedule from 'node-schedule';
import tzlookup from 'tz-lookup';
import { ContextMessageUpdate, Extra, Markup } from 'telegraf';

import { bot } from '../../bot';
import { SCENES } from '../lib/constants';
import { UserModel } from '../../models';
import { getRandomNeeds } from './lib/random-needs';
import { getBackKeyboard, getMainKeyboard } from '../../lib/keyboards';
import { randomNeedsList } from './lib/random-needs-list';

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

    const { timezone, timeForReminder, needs } = await UserModel.findByIdAndUpdate(
      {
        _id: id.toString(),
      },
      {
        $set: { timeForReminder: time },
      },
      { new: true },
    );
    const splittedTime = timeForReminder.split(':');
    const hour = splittedTime[0];
    const minute = splittedTime[1];
    const randomNeeds = getRandomNeeds(needs);

    schedule.scheduleJob({ hour, minute, tz: timezone }, () =>
      bot.telegram.sendMessage(
        id,
        i18n.t('scenes.remind.reminder_message'),
        randomNeedsList(randomNeeds),
      ),
    );

    await reply(
      `${i18n.t('scenes.remind.reminder_info')} \n${i18n.t(
        'common.time',
      )} ${timeForReminder} \n${i18n.t('common.timezone')} ${timezone} `,
      mainKeyboard,
    );
  },
);
