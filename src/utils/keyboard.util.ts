import { Markup } from 'telegraf';

export const getMainKeyboard = () => {
  const mainKeyboardCreatePrayer = '🙏 Создать молитвенную нужду';
  const mainKeyboardGetAllNeeds = '📝 Посмотреть все молитвенные нужды';
  const mainKeyboard = Markup.keyboard([
    [mainKeyboardCreatePrayer, mainKeyboardGetAllNeeds],
  ])
    .resize()
    .extra();

  return {
    mainKeyboard,
    mainKeyboardGetAllNeeds,
    mainKeyboardCreatePrayer,
  };
};
