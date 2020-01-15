import dayjs from 'dayjs';

import Scene from 'telegraf/scenes/base';
import { SCENES } from '../lib/constants';
import { UserModel } from '../../models';
import { ContextMessageUpdate } from 'telegraf';

export const statisticsScene = new Scene(SCENES.STATISTICS);

statisticsScene.enter(async ({ from, reply, i18n }: ContextMessageUpdate) => {
  const { id } = from;
  const {
    totalNeeds,
    totalPrayers,
    totalAnsweredNeeds,
    createdAt,
  } = await UserModel.findById(id);
  // const diffDays = dayjs(new Date()).diff(dayjs(createdAt), 'day');

  await reply(
    `${i18n.t('scenes.statistics.app_usage_in_days')} ${'diffDays'} ${i18n.t(
      'scenes.statistics.days',
    )} \n\n${i18n.t('scenes.statistics.qty_needs')} ${totalNeeds} \n${i18n.t(
      'scenes.statistics.qty_answers',
    )} ${totalAnsweredNeeds} \n${i18n.t(
      'scenes.statistics.qty_prayers',
    )} ${totalPrayers} \n\n${i18n.t('scenes.statistics.watch_verse')}`,
  );
});
