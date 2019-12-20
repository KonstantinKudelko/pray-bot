import { Extra, Markup } from 'telegraf';

export const getLanguageKeyboard = () =>
  Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      [
        m.callbackButton(
          `🇺🇸 English`,
          JSON.stringify({ a: 'languageChange', p: 'en' }),
          false,
        ),
        m.callbackButton(
          `🇷🇺 Русский`,
          JSON.stringify({ a: 'languageChange', p: 'ru' }),
          false,
        ),
      ],
      {},
    ),
  );
