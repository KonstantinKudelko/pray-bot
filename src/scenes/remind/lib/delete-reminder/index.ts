import { needsQueue } from '../reminder-queue';

export const deleteReminder = async (cron: string, tz: string) => {
  return await needsQueue.removeRepeatable({ cron, tz });
};
