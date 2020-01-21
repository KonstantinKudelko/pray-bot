import I18n from 'telegraf-i18n';
import { Extra, Markup } from 'telegraf';

export const getReminderControlMenu = (i18n: I18n, id: string) =>
  Extra.HTML().markup((m: Markup) => {
    return m.inlineKeyboard(
      [
        m.callbackButton(
          i18n.t('common.delete_button'),
          JSON.stringify({ action: 'delete', payload: id }),
          false,
        ),
        m.callbackButton(
          i18n.t('keyboards.back.button'),
          JSON.stringify({ action: 'back', payload: undefined }),
          false,
        ),
      ],
      {},
    );
  });
