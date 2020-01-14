import I18n from 'telegraf-i18n';
import Queue from 'bull';

import { bot } from '../../../../bot';
import { UserModel } from '../../../../models';
import { getRandomNeeds } from '../random-needs';
import { randomNeedsList } from '../random-needs-list';

const needsQueue = new Queue('needs_queue', process.env.REDIS_CONNECTION_STRING);

needsQueue.process(async job => {
  const { userId, message, needs } = job.data;

  return await bot.telegram.sendMessage(userId, message, needs);
});

export const reminder = async (
  id: string,
  i18n: I18n,
  hour: string,
  minute: string,
  timezone: string,
) => {
  const { needs } = await UserModel.findById(id);
  const randomNeeds = getRandomNeeds(needs);
  const message = randomNeeds.length
    ? i18n.t('scenes.remind.reminder_message')
    : i18n.t('scenes.remind.reminder_message_empty_needs');

  return needsQueue.add(
    {
      userId: id,
      message,
      needs: randomNeedsList(randomNeeds, i18n.t('scenes.remind.prayed_button')),
    },
    { repeat: { cron: `${minute} ${hour} * * *`, tz: timezone } },
  );
};
