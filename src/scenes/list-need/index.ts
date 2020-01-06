import Scene from 'telegraf/scenes/base';
import { Document } from 'mongoose';
import { ContextMessageUpdate } from 'telegraf';

import { UserModel } from '../../models';
import { exposeNeed } from './lib/need-middleware';
import { getNeedsList } from './lib/need-list';
import { getBackKeyboard, getMainKeyboard } from '../../lib/keyboards';
import { getNeedControlMenu } from './lib/need-control-menu';
import { SCENES, NEED_STATUS } from '../lib/constants';

export const listNeedScene = new Scene(SCENES.LIST_NEED);

listNeedScene.enter(async ({ from, reply, i18n }: ContextMessageUpdate) => {
  const { id } = from;
  const { backKeyboard } = getBackKeyboard(i18n);
  const { needs } = await UserModel.findById(id);

  if (needs.length) {
    await reply(i18n.t('scenes.list_need.available_action'), backKeyboard);
    await reply(i18n.t('scenes.list_need.welcome'), getNeedsList(needs));
  } else {
    await reply(i18n.t('scenes.list_need.empty_list_of_needs'));
  }
});

listNeedScene.action(
  /need/,
  exposeNeed,
  async ({ i18n, editMessageText, callbackQuery, need }: ContextMessageUpdate) => {
    const { payload } = JSON.parse(callbackQuery.data);

    await editMessageText(`${need.name}`, getNeedControlMenu(i18n, need, payload));
  },
);

listNeedScene.action(
  /back/,
  async ({ i18n, from, editMessageText }: ContextMessageUpdate) => {
    const { id } = from;
    const user = await UserModel.findById(id);

    await editMessageText(i18n.t('scenes.list_need.welcome'), getNeedsList(user.needs));
  },
);

listNeedScene.action(
  /edit_status/,
  async ({ i18n, from, editMessageText, callbackQuery }: ContextMessageUpdate) => {
    const { id } = from;
    const { payload } = JSON.parse(callbackQuery.data);
    const user = await UserModel.findById(id);
    const needs = (user.needs as unknown) as Document;

    needs.id(payload).set({ status: NEED_STATUS.ANSWERED });
    await user.save();

    await editMessageText(i18n.t('scenes.list_need.welcome'), getNeedsList(user.needs));
  },
);

listNeedScene.action(
  /delete/,
  async ({ i18n, from, reply, callbackQuery, editMessageText }: ContextMessageUpdate) => {
    const { id } = from;
    const { payload } = JSON.parse(callbackQuery.data);
    const user = await UserModel.findById(id);
    const needs = user.needs;
    const { mainKeyboard } = getMainKeyboard(i18n);

    --user.totalNeeds;
    needs.pull(payload);
    await user.save();

    if (needs.length) {
      await editMessageText(i18n.t('scenes.list_need.welcome'), getNeedsList(user.needs));
    } else {
      await reply(i18n.t('scenes.list_need.empty_list_of_needs'), mainKeyboard);
    }
  },
);
