import Scene from 'telegraf/scenes/base';
import { match } from 'telegraf-i18n';
import { ContextMessageUpdate, Stage } from 'telegraf';

import { SCENES } from '../lib/scenes';
import { Need, UserModel } from '../../models';
import { getBackKeyboard, getMainKeyboard } from '../../lib/keyboards';

const NEED_STATUS = Object.freeze({
  ACTIVE: 'active',
  ANSWERED: 'answered',
});

const { leave } = Stage;
export const createNeedScene = new Scene(SCENES.CREATE_NEED);

createNeedScene.enter(async ({ reply, i18n }: ContextMessageUpdate) => {
  const { backKeyboard } = getBackKeyboard(i18n);

  await reply(i18n.t('scenes.create_need.welcome'), backKeyboard);
});

createNeedScene.leave(async ({ reply, i18n }: ContextMessageUpdate) => {
  const { mainKeyboard } = getMainKeyboard(i18n);

  await reply(i18n.t('common.middleware_message'), mainKeyboard);
});

createNeedScene.hears(match('keyboards.back.button'), leave());

createNeedScene.on(
  'message',
  async ({ i18n, reply, from, message }: ContextMessageUpdate) => {
    const { id } = from;
    const { text } = message;
    const { mainKeyboard } = getMainKeyboard(i18n);
    const user = await UserModel.findById(id);

    ++user.totalNeeds;
    user.needs.push({
      name: text,
      status: NEED_STATUS.ACTIVE,
    } as Need);

    await user.save();
    await reply(i18n.t('scenes.create_need.success_message', mainKeyboard));
  },
);
