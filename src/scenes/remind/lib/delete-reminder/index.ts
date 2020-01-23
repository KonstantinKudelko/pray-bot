import { needsQueue } from '../reminder-queue';

export const deleteReminder = async (id: string, cron: string, tz: string) =>
  await needsQueue.removeRepeatable(id, { cron, tz });
