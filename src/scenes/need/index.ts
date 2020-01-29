import Scene from 'telegraf/scenes/base';
import { match } from 'telegraf-i18n';
import { Document } from 'mongoose';
import { ContextMessageUpdate, Stage } from 'telegraf';

import { encrypt, decrypt } from '../lib/encrypt';
import { getNeedKeyboard } from './keyboard';
import { getMainKeyboard } from '../../lib/keyboards';
import { getNeedControlMenu } from './need-control-menu';
import { SCENES, NEED_STATUS } from '../lib/constants';
import { NeedModel, UserModel } from '../../models';
import { getNeedsByStatus, getNeedsList } from './need-list';
import { exposeNeed, setCreatingNeedMode, setAnsweredNeedMode } from './need-middleware';
import { handleCreatingNeedMode, handleAnsweredNeedMode } from './need-mode-actions';

const { leave } = Stage;
export const needScene = new Scene(SCENES.NEED);

needScene.enter(async ({ reply, i18n }: ContextMessageUpdate) => {
  const { needKeyboard } = getNeedKeyboard(i18n);

  await reply(i18n.t('scenes.need.welcome'), needKeyboard);
});

needScene.leave(async ({ reply, i18n }: ContextMessageUpdate) => {
  const { mainKeyboard } = getMainKeyboard(i18n);

  await reply(i18n.t('common.middleware_message'), mainKeyboard);
});

needScene.hears(match('keyboards.back.button'), leave());

needScene.hears(
  match('keyboards.need.create'),
  setCreatingNeedMode,
  async ({ reply, i18n }: ContextMessageUpdate) =>
    await reply(i18n.t('scenes.need.create_need')),
);

needScene.hears(
  match('keyboards.need.list_answered_needs'),
  async ({ from, reply, i18n }: ContextMessageUpdate) => {
    const { id } = from;
    const user = await UserModel.findById(id);

    if (user.needs && user.needs.length) {
      const answeredNeeds = getNeedsByStatus(user.needs, NEED_STATUS.ANSWERED);
      await reply(
        i18n.t('scenes.need.answered_needs_welcome'),
        getNeedsList(answeredNeeds),
      );
    } else {
      await reply(i18n.t('scenes.need.answered_active_needs'));
    }
  },
);

needScene.hears(
  match('keyboards.need.list_active_needs'),
  async ({ from, reply, i18n }: ContextMessageUpdate) => {
    const { id } = from;
    const user = await UserModel.findById(id);

    if (user.needs && user.needs.length) {
      const activeNeeds = getNeedsByStatus(user.needs, NEED_STATUS.ACTIVE);

      await reply(i18n.t('scenes.need.active_needs_welcome'), getNeedsList(activeNeeds));
    } else {
      await reply(i18n.t('scenes.need.empty_active_needs'));
    }
  },
);

needScene.on(
  'message',
  async ({ i18n, reply, from, message, session }: ContextMessageUpdate) => {
    const { id } = from;
    const { text } = message;
    const user = await UserModel.findById(id);

    if (text.length > 250) {
      await reply(i18n.t('scenes.need.error'));

      return;
    }

    if (session.isAnswerNeedMode) {
      await handleAnsweredNeedMode(user, session.need.id, text);
      await reply(i18n.t('scenes.need.create_answer_success'));

      return;
    } else {
      await handleCreatingNeedMode(user, text);
      await reply(i18n.t('scenes.need.create_need_success'));

      return;
    }
  },
);

needScene.action(
  /need/,
  exposeNeed,
  async ({
    i18n,
    editMessageText,
    callbackQuery,
    session,
    replyWithMarkdown,
  }: ContextMessageUpdate) => {
    const { need } = session;
    const { payload } = JSON.parse(callbackQuery.data);

    if (need.answer) {
      await replyWithMarkdown(
        `${i18n.t('scenes.need.need_label')} \n ${`${decrypt(need.name)}`} \n\n${i18n.t(
          'scenes.need.answer_label',
        )} \n ${need.answer}`,
      );
    } else {
      await editMessageText(
        `${decrypt(need.name)}`,
        getNeedControlMenu(i18n, need, payload),
      );
    }
  },
);

needScene.action(
  /back/,
  async ({ i18n, from, editMessageText }: ContextMessageUpdate) => {
    const { id } = from;
    const user = await UserModel.findById(id);
    const activeNeeds = getNeedsByStatus(user.needs, NEED_STATUS.ACTIVE);

    await editMessageText(
      i18n.t('scenes.need.active_needs_welcome'),
      getNeedsList(activeNeeds),
    );
  },
);

needScene.action(
  /edit_status/,
  setAnsweredNeedMode,
  async ({ i18n, from, editMessageText, callbackQuery }: ContextMessageUpdate) => {
    const { id } = from;
    const { payload } = JSON.parse(callbackQuery.data);
    const user = await UserModel.findById(id);
    const needs = (user.needs as unknown) as Document;

    ++user.totalAnsweredNeeds;
    await needs.id(payload).set({ status: NEED_STATUS.ANSWERED });
    await user.save();

    await editMessageText(i18n.t('scenes.need.write_answer'));
  },
);

needScene.action(
  /delete/,
  async ({ i18n, from, reply, callbackQuery, editMessageText }: ContextMessageUpdate) => {
    const { id } = from;
    const { payload } = JSON.parse(callbackQuery.data);
    const user = await UserModel.findById(id);
    const needs = user.needs;
    const { mainKeyboard } = getMainKeyboard(i18n);

    --user.totalNeeds;
    needs.pull(payload);
    const newUser = await user.save();
    const activeNeeds = getNeedsByStatus(newUser.needs, NEED_STATUS.ACTIVE);

    if (activeNeeds.length) {
      await editMessageText(
        i18n.t('scenes.need.active_needs_welcome'),
        getNeedsList(activeNeeds),
      );
    } else {
      await reply(i18n.t('scenes.need.scenes.need.empty_active_needs'), mainKeyboard);
    }
  },
);
