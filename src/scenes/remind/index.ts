import Scene from 'telegraf/scenes/base';
import tzlookup from 'tz-lookup';
import { match } from 'telegraf-i18n';
import { ContextMessageUpdate } from 'telegraf';

import { SCENES } from '../lib/constants';
import { setReminder } from './lib/set-reminder';
import { getBackKeyboard } from '../../lib/keyboards';
import { getReminderKeyboard } from './lib/keyboard';
import { UserModel, ReminderModel } from '../../models';
import { getRemindersList } from './lib/reminders-list';
import { getReminderControlMenu } from './lib/reminder-control-menu';
import { deleteReminder } from './lib/delete-reminder';

export const remindScene = new Scene(SCENES.REMIND);

remindScene.enter(async ({ reply, i18n }: ContextMessageUpdate) => {
  const { reminderKeyboard } = getReminderKeyboard(i18n);

  await reply(i18n.t('scenes.remind.welcome'), reminderKeyboard);
});

remindScene.hears(
  match('keyboards.reminder.create'),
  async ({ reply, i18n }: ContextMessageUpdate) => {
    const { backKeyboard } = getBackKeyboard(i18n);

    await reply(i18n.t('scenes.remind.create_welcome'), backKeyboard);
  },
);

remindScene.on(
  'location',
  async ({ i18n, from, reply, message }: ContextMessageUpdate) => {
    const { id } = from;
    const { location } = message;
    const { latitude, longitude } = location;
    const timezone = tzlookup(latitude, longitude);
    const { backKeyboard } = getBackKeyboard(i18n);

    await UserModel.findByIdAndUpdate(
      {
        _id: id.toString(),
      },
      {
        $set: { timezone },
      },
    );

    await reply(`${i18n.t('scenes.remind.success_timezone')} ${timezone} 📍`);
    await reply(i18n.t('scenes.remind.set_time'), backKeyboard);
  },
);

remindScene.hears(
  /\d+:\d+/,
  async ({ i18n, from, reply, match }: ContextMessageUpdate) => {
    const { id } = from;
    const { reminderKeyboard } = getReminderKeyboard(i18n);

    const user = await UserModel.findById(id);
    const timezone = user.timezone;
    const time = match[0];
    const splittedTime = time.split(':');
    const hour = splittedTime[0];
    const minute = splittedTime[1];
    const cronString = `${minute} ${hour} * * *`;

    await setReminder(id.toString(), i18n, cronString, timezone);
    user.reminders.push(
      new ReminderModel({
        time,
        _id: cronString,
      }),
    );

    await user.save();
    await reply(
      `${i18n.t('scenes.remind.reminder_info')} \n${i18n.t(
        'common.time',
      )} ${time} \n${i18n.t('common.timezone')} ${timezone} `,
      reminderKeyboard,
    );
  },
);

remindScene.hears(
  match('keyboards.reminder.list'),
  async ({ from, reply, i18n }: ContextMessageUpdate) => {
    const { id } = from;
    const { reminders } = await UserModel.findById(id);
    const remindersList = getRemindersList(reminders, i18n);

    if (Array.isArray(reminders) && reminders.length) {
      await reply(i18n.t('scenes.remind.list_welcome'), remindersList);
    } else {
      await reply(i18n.t('scenes.remind.list_empty_welcome'));
    }
  },
);

remindScene.action(
  /reminder/,
  async ({ i18n, editMessageText, callbackQuery }: ContextMessageUpdate) => {
    const { p } = JSON.parse(callbackQuery.data);

    await editMessageText(
      `${i18n.t('scenes.remind.reminder_type')} ${p.time}`,
      getReminderControlMenu(i18n, p.id),
    );
  },
);

remindScene.action(
  /back/,
  async ({ i18n, from, editMessageText }: ContextMessageUpdate) => {
    const { id } = from;
    const { reminders } = await UserModel.findById(id);
    const remindersList = getRemindersList(reminders, i18n);

    await editMessageText(i18n.t('scenes.remind.list_welcome'), remindersList);
  },
);

remindScene.action(
  /delete/,
  async ({ i18n, from, editMessageText, callbackQuery }: ContextMessageUpdate) => {
    const { id } = from;
    const { payload } = JSON.parse(callbackQuery.data);
    const user = await UserModel.findById(id);
    const reminders = user.reminders;
    const updatedReminders = reminders.pull(payload);
    const remindersList = getRemindersList(updatedReminders, i18n);

    await user.save();
    await deleteReminder(payload, user.timezone);

    if (Array.isArray(reminders) && reminders.length) {
      await editMessageText(i18n.t('scenes.remind.list_welcome'), remindersList);
    } else {
      await editMessageText(i18n.t('scenes.remind.list_empty_welcome'));
    }
  },
);
