import I18n from 'telegraf-i18n';

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

const getLanguageKeyboard = () =>
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

const getMainKeyboard = (i18n: I18n) => {
  const mainKeyboardRemind = i18n.t('keyboards.main.remind');
  const mainKeyboardGetAllNeeds = i18n.t('keyboards.main.list_needs');
  const mainKeyboardCreatePrayer = i18n.t('keyboards.main.create');
  const mainKeyboardAboutUs = i18n.t('keyboards.main.about_us');
  const mainKeyboardStatistics = i18n.t('keyboards.main.statistics');
  const mainKeyboard = Markup.keyboard([
    [mainKeyboardCreatePrayer, mainKeyboardGetAllNeeds],
    [mainKeyboardRemind, mainKeyboardAboutUs],
    [mainKeyboardStatistics],
  ])
    .resize()
    .extra();

  return {
    mainKeyboard,
    mainKeyboardRemind,
    mainKeyboardGetAllNeeds,
    mainKeyboardCreatePrayer,
  };
};

const getBackKeyboard = (i18n: I18n) => {
  const backKeyboardButton = i18n.t('keyboards.back.button');
  const backKeyboard = Markup.keyboard([[backKeyboardButton]])
    .resize()
    .extra();

  return {
    backKeyboard,
    backKeyboardButton,
  };
};

export { getMainKeyboard, getLanguageKeyboard, getBackKeyboard };
