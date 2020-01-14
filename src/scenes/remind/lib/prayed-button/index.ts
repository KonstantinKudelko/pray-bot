import { Extra, Markup } from 'telegraf';

export const prayedButton = (label: string) =>
  Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      [
        m.callbackButton(
          label,
          JSON.stringify({ action: 'prayed', payload: null }),
          false,
        ),
      ],
      {},
    ),
  );
