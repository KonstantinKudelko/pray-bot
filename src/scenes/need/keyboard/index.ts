import I18n from 'telegraf-i18n';
import { Markup } from 'telegraf';

import { getBackKeyboard } from '../../../lib/keyboards';

export const getNeedKeyboard = (i18n: I18n) => {
  const { backKeyboardButton } = getBackKeyboard(i18n);
  const createNeedKeyboardButton = i18n.t('keyboards.need.create');
  const activeNeedsListKeyboardButton = i18n.t('keyboards.need.list_active_needs');
  const answeredNeedsListKeyboardButton = i18n.t('keyboards.need.list_answered_needs');

  const needKeyboard = Markup.keyboard([
    [createNeedKeyboardButton],
    [activeNeedsListKeyboardButton],
    [answeredNeedsListKeyboardButton],
    [backKeyboardButton],
  ])
    .resize()
    .extra();

  return {
    needKeyboard,
    createNeedKeyboardButton,
    activeNeedsListKeyboardButton,
    answeredNeedsListKeyboardButton,
  };
};
