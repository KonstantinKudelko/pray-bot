import Scene from 'telegraf/scenes/base';
import { ContextMessageUpdate, Extra, Markup } from 'telegraf';

import { SCENES, NEED_STATUS } from '../lib/constants';
import { UserModel, Need } from '../../models';
import { getBackKeyboard } from '../../lib/keyboards';

const getNeedsList = (needs: Need[]) =>
  Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      needs.map(x => [
        m.callbackButton(
          `${x.name} ${x.status === NEED_STATUS.ACTIVE ? '🙏' : '✅'}`,
          JSON.stringify({ a: 'need', p: x._id }),
          false,
        ),
      ]),
      {},
    ),
  );

export const listNeedScene = new Scene(SCENES.LIST_NEED);

listNeedScene.enter(async ({ from, reply, i18n }: ContextMessageUpdate) => {
  const { id } = from;
  const { backKeyboard } = getBackKeyboard(i18n);
  const { needs } = await UserModel.findById(id);

  await reply(i18n.t('scenes.list_need.welcome'), getNeedsList(needs));
  await reply(i18n.t('scenes.list_need.available_action'), backKeyboard);
});
