import Scene from 'telegraf/scenes/base';
import { Document } from 'mongoose';
import { ContextMessageUpdate } from 'telegraf';

import { SCENES, NEED_STATUS } from '../lib/constants';
import { UserModel, Need } from '../../models';
import { exposeNeed } from './lib/need-middleware';
import { getNeedsList } from './lib/need-list';
import { getBackKeyboard } from '../../lib/keyboards';
import { getNeedControlMenu } from './lib/need-control-menu';

export const listNeedScene = new Scene(SCENES.LIST_NEED);

listNeedScene.enter(async ({ from, reply, i18n, session }: ContextMessageUpdate) => {
  const { id } = from;
  const { backKeyboard } = getBackKeyboard(i18n);
  const { needs } = await UserModel.findById(id);

  session.needs = needs;

  await reply(i18n.t('scenes.list_need.available_action'), backKeyboard);
  await reply(i18n.t('scenes.list_need.welcome'), getNeedsList(needs));
});

listNeedScene.action(
  /need/,
  exposeNeed,
  async ({ i18n, editMessageText, callbackQuery, need }: ContentMessageUpdate) => {
    const { payload } = JSON.parse(callbackQuery.data);

    await editMessageText(`${need.name}`, getNeedControlMenu(i18n, need, payload));
  },
);

listNeedScene.action(
  /back/,
  async ({ i18n, editMessageText, answerCbQuery, session }: ContextMessageUpdate) => {
    await editMessageText(
      i18n.t('scenes.list_need.welcome'),
      getNeedsList(session.needs),
    );
    await answerCbQuery();
  },
);

listNeedScene.action(
  /edit_status/,
  async ({
    i18n,
    from,
    editMessageText,
    callbackQuery,
    answerCbQuery,
  }: ContextMessageUpdate) => {
    const { id } = from;
    const { payload } = JSON.parse(callbackQuery.data);
    const user = await UserModel.findById(id);
    const needs = (user.needs as unknown) as Document;

    needs.id(payload).set({ status: NEED_STATUS.ANSWERED });
    await user.save();

    await editMessageText(i18n.t('scenes.list_need.welcome'), getNeedsList(user.needs));
    await answerCbQuery();
  },
);

listNeedScene.action(
  /delete/,
  async ({
    i18n,
    from,
    callbackQuery,
    editMessageText,
    answerCbQuery,
  }: ContextMessageUpdate) => {
    const { id } = from;
    const { payload } = JSON.parse(callbackQuery.data);
    const user = await UserModel.findById(id);
    const needs = user.needs;

    --user.totalNeeds;
    needs.pull(payload);
    await user.save();

    await editMessageText(i18n.t('scenes.list_need.welcome'), getNeedsList(user.needs));
    await answerCbQuery();
  },
);
