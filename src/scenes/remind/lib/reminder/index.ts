import I18n from 'telegraf-i18n';
import schedule from 'node-schedule';

import { bot } from '../../../../bot';
import { UserModel } from '../../../../models';
import { getRandomNeeds } from '../random-needs';
import { randomNeedsList } from '../random-needs-list';

export const reminder = (
  id: string,
  i18n: I18n,
  hour: string,
  minute: string,
  timezone: string,
) =>
  schedule.scheduleJob({ hour, minute, tz: timezone }, async () => {
    const { needs } = await UserModel.findById(id);
    const randomNeeds = getRandomNeeds(needs);

    bot.telegram.sendMessage(
      id,
      i18n.t('scenes.remind.reminder_message'),
      randomNeedsList(randomNeeds),
    );
  });
