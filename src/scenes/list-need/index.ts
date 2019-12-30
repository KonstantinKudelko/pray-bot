import I18n from 'telegraf-i18n';
import Scene from 'telegraf/scenes/base';
import { ContextMessageUpdate, Extra, Markup } from 'telegraf';

import { UserModel, Need } from '../../models';
import { getBackKeyboard } from '../../lib/keyboards';
import { SCENES, NEED_STATUS } from '../lib/constants';

const getNeedsList = (needs: Need[]) =>
  Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      needs.map(x => [
        m.callbackButton(
          `${x.name} ${x.status === NEED_STATUS.ACTIVE ? ' ➖ 🙏' : ' ➖ ✅'}`,
          JSON.stringify({ action: 'need', payload: x._id.toString() }),
          false,
        ),
      ]),
      {},
    ),
  );

const getNeedControlMenu = (i18n: I18n, id: string) =>
  Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      [
        m.callbackButton(
          i18n.t('scenes.list_need.delete_button'),
          JSON.stringify({ action: 'delete', payload: id }),
          false,
        ),
        m.callbackButton(
          i18n.t('scenes.list_need.edit_status_button'),
          JSON.stringify({ action: 'edit_status', payload: id }),
          false,
        ),
        m.callbackButton(
          i18n.t('keyboards.back.button'),
          JSON.stringify({ action: 'back', payload: undefined }),
          false,
        ),
      ],
      {},
    ),
  );

const exposeNeed = (ctx: ContextMessageUpdate, next: () => void) => {
  const { payload } = JSON.parse(ctx.callbackQuery.data);

  ctx.need = ctx.session.needs.find((item: Need) => item._id.toString() === payload);

  return next();
};

export const listNeedScene = new Scene(SCENES.LIST_NEED);

listNeedScene.enter(async ({ from, reply, i18n, session }: ContextMessageUpdate) => {
  const { id } = from;
  const { backKeyboard } = getBackKeyboard(i18n);
  const { needs } = await UserModel.findById(id);

  session.needs = needs;

  await reply(i18n.t('scenes.list_need.welcome'), getNeedsList(needs));
  await reply(i18n.t('scenes.list_need.available_action'), backKeyboard);
});

listNeedScene.action(
  /need/,
  exposeNeed,
  async ({ i18n, editMessageText, callbackQuery, need }: ContentMessageUpdate) => {
    const { payload } = JSON.parse(callbackQuery.data);

    await editMessageText(`${need.name}`, getNeedControlMenu(i18n, payload));
  },
);
