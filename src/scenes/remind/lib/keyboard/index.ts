import I18n from 'telegraf-i18n';
import { Markup } from 'telegraf';

import { getBackKeyboard } from '../../../../lib/keyboards';

export const getReminderKeyboard = (i18n: I18n) => {
  const remindersListKeyboardButton = i18n.t('keyboards.reminder.list');
  const createReminderKeyboardButton = i18n.t('keyboards.reminder.create');
  const { backKeyboardButton } = getBackKeyboard(i18n);

  const reminderKeyboard = Markup.keyboard([
    [createReminderKeyboardButton, remindersListKeyboardButton],
    [backKeyboardButton],
  ])
    .resize()
    .extra();

  return {
    reminderKeyboard,
    remindersListKeyboardButton,
    createReminderKeyboardButton,
  };
};
