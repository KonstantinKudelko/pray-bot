import Scene from 'telegraf/scenes/base';
import { match } from 'telegraf-i18n';
import { ContextMessageUpdate, Stage } from 'telegraf';

import { encrypt } from './lib/encrypt';
import { SCENES, NEED_STATUS } from '../lib/constants';
import { UserModel, NeedModel } from '../../models';
import { getBackKeyboard, getMainKeyboard } from '../../lib/keyboards';

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
    user.needs.push(
      new NeedModel({
        name: encrypt(text),
        status: NEED_STATUS.ACTIVE,
      }),
    );

    await user.save();
    await reply(i18n.t('scenes.create_need.success_message', mainKeyboard));
  },
);
