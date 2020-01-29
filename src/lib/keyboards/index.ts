import I18n from 'telegraf-i18n';

import { Markup } from 'telegraf';

const getMainKeyboard = (i18n: I18n) => {
  const mainKeyboardNeed = i18n.t('keyboards.main.need');
  const mainKeyboardRemind = i18n.t('keyboards.main.remind');
  const mainKeyboardGetAllNeeds = i18n.t('keyboards.main.list_needs');
  const mainKeyboardCreatePrayer = i18n.t('keyboards.main.create');
  const mainKeyboardAboutUs = i18n.t('keyboards.main.about_us');
  const mainKeyboardStatistics = i18n.t('keyboards.main.statistics');
  const mainKeyboard = Markup.keyboard([
    [mainKeyboardNeed, mainKeyboardRemind],
    [mainKeyboardStatistics, mainKeyboardAboutUs],
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

export { getMainKeyboard, getBackKeyboard };
