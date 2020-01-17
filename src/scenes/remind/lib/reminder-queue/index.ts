import Queue from 'bull';

import { bot } from '../../../../bot';
import { UserModel } from '../../../../models';
import { getRandomNeeds, getRandomNeedsList } from '../random-needs';

export const needsQueue = new Queue('needs_queue', process.env.REDIS_CONNECTION_STRING);

needsQueue.process(async job => {
  const { id, message } = job.data;
  const { needs } = await UserModel.findById(id);
  const randomNeeds = getRandomNeeds(needs);

  await bot.telegram.sendMessage(id, message, getRandomNeedsList(randomNeeds));
});
