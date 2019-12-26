import { Extra, Markup } from 'telegraf';

export const LANGUAGE_ACTION = 'LANGUAGE_CHANGE';
const LANGUAGES = Object.freeze({
  EN: {
    code: 'en',
    label: '🇺🇸 English',
  },
  RU: {
    code: 'ru',
    label: '🇷🇺 Русский',
  },
});

export const getLanguageKeyboard = () =>
  Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      [
        m.callbackButton(
          LANGUAGES.EN.label,
          JSON.stringify({ action: LANGUAGE_ACTION, lang: LANGUAGES.EN.code }),
          false,
        ),
        m.callbackButton(
          LANGUAGES.RU.label,
          JSON.stringify({ action: LANGUAGE_ACTION, lang: LANGUAGES.RU.code }),
          false,
        ),
      ],
      {},
    ),
  );
