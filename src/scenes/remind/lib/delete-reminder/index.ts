import { needsQueue } from '../reminder-queue';

export const deleteReminder = async () => {
  const repeatableJobs = await needsQueue.getRepeatableJobs();

  repeatableJobs.forEach(async job => await needsQueue.removeRepeatableByKey(job.key));
};
