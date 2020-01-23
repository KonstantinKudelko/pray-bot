import I18n from 'telegraf-i18n';
import { Markup, Extra } from 'telegraf';

import { Reminder } from '../../../../models';

export const getRemindersList = (timezone: string, reminders: Reminder[], i18n: I18n) =>
  Extra.HTML().markup((m: Markup) =>
    m.inlineKeyboard(
      reminders.map(x => [
        m.callbackButton(
          `${i18n.t('scenes.remind.reminder_type')} ${x.time}  📍 ${timezone}`,
          JSON.stringify({ a: 'reminder', p: { id: x._id, time: x.time } }),
          !reminders.length,
        ),
      ]),
      {},
    ),
  );
