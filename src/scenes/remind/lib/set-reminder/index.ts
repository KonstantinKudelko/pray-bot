import I18n from 'telegraf-i18n';
import Queue from 'bull';

import { bot } from '../../../../bot';

const needsQueue = new Queue('needs_queue', process.env.REDIS_CONNECTION_STRING);

needsQueue.process(async job => {
  const { id } = job.data;

  await bot.telegram.sendMessage(id, 'Pray for your needs!');
});

export const setReminder = async (id: string, i18n: I18n, cron: string, tz: string) => {
  await needsQueue.add(
    {
      id,
    },
    { repeat: { cron, tz } },
  );
};
